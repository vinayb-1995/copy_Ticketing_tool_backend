const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    uniqueticketID: { type: String, required: true }, 
    adminName: { type: String, required: true },
    adminId: { type: String, required: true },
    adminMailID: { type: String, required: true },
    customerName: { type: String, required: true },
    customerID: { type: String, required: true },
    customerMailID: { type: String, required: true },
    customerContactNumber: { type: String, required: true },
    department: { type: String, required: true },
    subModule: { type: String, required: true },
    issueType: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String }, // For storing image file paths if needed
    ticketGeneratedDate: { type: Date, default: Date.now }, // Automatically sets the current date and time
    status: { 
        type: String, 
        // Common for all roles, logic to restrict agent handled in controllers
    },
    adminAssigned: {
        isAssigned: { type: Boolean, default: false },
        assignedTo: { type: String}, // Assuming 'agent' is your agent model
        assignedAt: { type: Date },
        endDateAdnTime: { type: String },
        wricef: { type: String },
        actualHrs: { type: String },
        plannedHrs: { type: String },
        actualCost: { type: String },
        plannedCost: { type: String },
        adminDescription: { type: String },
        /*  status: { 
             type: String, 
             enum: ['open', 'close', 'pending', 'resolved'], // Admin can choose from these
             default: 'open' 
         }, */
    },
    agentUpdate: {
        resolutionDetails: { type: String },
        resolvedAt: { type: Date },
        agentUpdatedDateandtime: { type: Date }, // Auto-updated with pre-save hook
        ReviewSolution: { type: String },
        /* status: { 
            type: String, 
            enum: ['open', 'resolved', 'pending'], // Agent can only set 'open', 'resolved', or 'pending'
            default: 'open'
        }, */
        // actualHrs: { type: Number },
        // planedHrs: { type: Number },
        // actualCost: { type: Number },
        // planedCost: { type: Number },
        // endDateAndTime: { type: Date },
    }
}, { timestamps: true });

// Create a unique compound index on (adminmailID, ticketID)
// ticketSchema.index({ adminmailID: 1, uniqueticketID: 1 }, { unique: true });
ticketSchema.index({ adminMailID: 1, uniqueticketID: 1 }, { unique: true });
                                        

// Pre-save hook to update 'agentUpdatedDateandtime' field whenever agent updates the ticket
// ticketSchema.pre('save', function(next) {
//     if (this.isModified('agentUpdate')) {
//         this.agentUpdate.agentUpdatedDateandtime = new Date(); // Set the current date and time
//     }
//     next();
// });

const Tickets = mongoose.model('Ticket', ticketSchema);
module.exports = Tickets;
