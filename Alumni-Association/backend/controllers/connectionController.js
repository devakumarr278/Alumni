const User = require('../models/User');
const Connection = require('../models/Connection');
const { NotificationController } = require('./notificationController');
const mongoose = require('mongoose');

// We'll initialize this when the server starts
let webSocketServer = null;

// Function to set the WebSocket server instance
const setWebSocketServer = (wss) => {
  webSocketServer = wss;
};

class ConnectionController {
  // Connect with a student (alumni initiates connection)
  static async connectWithStudent(req, res) {
    try {
      const { studentId } = req.body;
      const alumniId = req.user.id;

      // Validate studentId
      if (!studentId) {
        return res.status(400).json({
          success: false,
          message: 'Student ID is required'
        });
      }

      // Check if user is trying to connect with themselves
      if (alumniId === studentId) {
        return res.status(400).json({
          success: false,
          message: 'You cannot connect with yourself'
        });
      }

      // Check if student exists and is approved
      const student = await User.findOne({
        _id: studentId,
        userType: 'student',
        status: 'approved'
      });

      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Student not found'
        });
      }

      // Check if already connected or request pending
      const existingConnection = await Connection.findOne({
        alumniId: alumniId,
        studentId: studentId
      });

      if (existingConnection) {
        if (existingConnection.status === 'connected') {
          return res.json({
            success: true,
            data: { alreadyConnected: true },
            message: 'Already connected with this student'
          });
        } else if (existingConnection.status === 'pending') {
          return res.json({
            success: true,
            data: { alreadyConnected: false },
            message: 'Connection request already sent and pending approval'
          });
        }
      }

      // Create connection request
      const connectionRequest = new Connection({
        alumniId: alumniId,
        studentId: studentId,
        status: 'pending',
        initiatedBy: 'alumni'
      });

      await connectionRequest.save();
      console.log('Connection request created with ID:', connectionRequest._id);

      // Create notification for the student
      await NotificationController.createConnectionRequestNotification(connectionRequest._id, alumniId, studentId);

      res.json({
        success: true,
        message: 'Connection request sent successfully'
      });
    } catch (error) {
      console.error('Connect with student error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to connect with student'
      });
    }
  }

  // Get connection status with a student
  static async getConnectionStatus(req, res) {
    try {
      const { studentId } = req.params;
      const alumniId = req.user.id;

      // Validate studentId
      if (!studentId) {
        return res.status(400).json({
          success: false,
          message: 'Student ID is required'
        });
      }

      // Check if student exists
      const student = await User.findOne({
        _id: studentId,
        userType: 'student'
      });

      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Student not found'
        });
      }

      // Check connection status
      const connectionRecord = await Connection.findOne({
        alumniId: alumniId,
        studentId: studentId
      });

      res.json({
        success: true,
        data: { 
          isConnected: connectionRecord && connectionRecord.status === 'connected',
          hasRequested: connectionRecord && connectionRecord.status === 'pending'
        }
      });
    } catch (error) {
      console.error('Get connection status error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get connection status'
      });
    }
  }

  // Get all connections for the current user
  static async getConnections(req, res) {
    try {
      const userId = req.user.id;
      const userType = req.user.userType;

      let connections;
      
      if (userType === 'alumni') {
        // Get connections for alumni
        connections = await Connection.find({
          alumniId: userId,
          status: 'connected'
        }).populate({
          path: 'studentId',
          select: 'firstName lastName email department year college gradYear skills location github linkedin profilePicture',
          model: 'User'
        });
      } else if (userType === 'student') {
        // Get connections for student
        connections = await Connection.find({
          studentId: userId,
          status: 'connected'
        }).populate({
          path: 'alumniId',
          select: 'firstName lastName email department college gradYear skills location github linkedin profilePicture currentPosition company',
          model: 'User'
        });
      } else {
        return res.status(400).json({
          success: false,
          message: 'Invalid user type'
        });
      }

      res.json({
        success: true,
        data: { connections }
      });
    } catch (error) {
      console.error('Get connections error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get connections'
      });
    }
  }

  // Accept a connection request
  static async acceptConnection(req, res) {
    try {
      const { connectionId } = req.params;
      const userId = req.user.id;
      const userType = req.user.userType;

      // Validate connectionId format
      if (!connectionId || connectionId.length !== 24 || !mongoose.Types.ObjectId.isValid(connectionId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid connection ID format'
        });
      }

      // Find the connection request
      const connection = await Connection.findById(connectionId);

      if (!connection) {
        return res.status(404).json({
          success: false,
          message: 'Connection request not found'
        });
      }

      // Check if this user is authorized to accept the request
      if (
        (userType === 'alumni' && connection.alumniId.toString() !== userId) ||
        (userType === 'student' && connection.studentId.toString() !== userId)
      ) {
        return res.status(403).json({
          success: false,
          message: 'You are not authorized to accept this connection request'
        });
      }

      // Update status to connected
      connection.status = 'connected';
      connection.connectedAt = Date.now();
      await connection.save();

      // Send real-time update via WebSocket
      if (webSocketServer) {
        const otherUserId = userType === 'alumni' ? connection.studentId : connection.alumniId;
        webSocketServer.sendConnectionUpdate(otherUserId, {
          connectionId: connectionId,
          status: 'connected',
          userId: userId
        });
      }

      res.json({
        success: true,
        message: 'Connection accepted successfully'
      });
    } catch (error) {
      console.error('Accept connection error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to accept connection'
      });
    }
  }

  // Reject a connection request
  static async rejectConnection(req, res) {
    try {
      const { connectionId } = req.params;
      const userId = req.user.id;
      const userType = req.user.userType;

      // Validate connectionId format
      if (!connectionId || connectionId.length !== 24 || !mongoose.Types.ObjectId.isValid(connectionId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid connection ID format'
        });
      }

      // Find the connection request
      const connection = await Connection.findById(connectionId);

      if (!connection) {
        return res.status(404).json({
          success: false,
          message: 'Connection request not found'
        });
      }

      // Check if this user is authorized to reject the request
      if (
        (userType === 'alumni' && connection.alumniId.toString() !== userId) ||
        (userType === 'student' && connection.studentId.toString() !== userId)
      ) {
        return res.status(403).json({
          success: false,
          message: 'You are not authorized to reject this connection request'
        });
      }

      // Delete the connection request
      await Connection.findByIdAndDelete(connectionId);

      // Send real-time update via WebSocket
      if (webSocketServer) {
        const otherUserId = userType === 'alumni' ? connection.studentId : connection.alumniId;
        webSocketServer.sendConnectionUpdate(otherUserId, {
          connectionId: connectionId,
          status: 'rejected',
          userId: userId
        });
      }

      res.json({
        success: true,
        message: 'Connection request rejected successfully'
      });
    } catch (error) {
      console.error('Reject connection error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to reject connection'
      });
    }
  }
}

module.exports = { ConnectionController, setWebSocketServer };