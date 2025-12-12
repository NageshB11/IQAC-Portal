import mongoose from 'mongoose';

// Research Publication Schema
const researchPublicationSchema = new mongoose.Schema({
    faculty: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    authors: {
        type: String,
        required: true
    },
    journalConference: {
        type: String,
        required: true
    },
    publicationType: {
        type: String,
        enum: ['journal', 'conference', 'book', 'chapter', 'patent'],
        required: true
    },
    publicationDate: {
        type: Date,
        required: true
    },
    doi: String,
    issn: String,
    isbn: String,
    impactFactor: Number,
    indexing: [{
        type: String,
        enum: ['scopus', 'sci', 'web-of-science', 'ugc-care']
    }],
    citationCount: {
        type: Number,
        default: 0
    },
    documentUrl: String,
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'approved'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// FDP/STTP/Workshop Schema
const professionalDevelopmentSchema = new mongoose.Schema({
    faculty: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['fdp', 'sttp', 'workshop', 'seminar', 'conference', 'training'],
        required: true
    },
    organizer: {
        type: String,
        required: true
    },
    duration: {
        type: Number, // in days
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    mode: {
        type: String,
        enum: ['online', 'offline', 'hybrid'],
        required: true
    },
    certificateUrl: String,
    description: String,
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Course Taught Schema
const courseTaughtSchema = new mongoose.Schema({
    faculty: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    academicYear: {
        type: String,
        required: true
    },
    semester: {
        type: String,
        enum: ['1', '2', '3', '4', '5', '6', '7', '8'],
        required: true
    },
    courseCode: {
        type: String,
        required: true
    },
    courseName: {
        type: String,
        required: true
    },
    courseType: {
        type: String,
        enum: ['theory', 'practical', 'project', 'elective'],
        required: true
    },
    credits: {
        type: Number,
        required: true
    },
    totalStudents: {
        type: Number,
        required: true
    },
    hoursPerWeek: {
        type: Number,
        required: true
    },
    syllabusCompletion: {
        type: Number, // percentage
        default: 0,
        min: 0,
        max: 100
    },
    status: {
        type: String,
        enum: ['ongoing', 'completed'],
        default: 'ongoing'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Event Organized Schema
const eventOrganizedSchema = new mongoose.Schema({
    faculty: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
        required: true
    },
    eventName: {
        type: String,
        required: true
    },
    eventType: {
        type: String,
        enum: ['workshop', 'seminar', 'webinar', 'competition', 'cultural', 'technical', 'other'],
        required: true
    },
    eventDate: {
        type: Date,
        required: true
    },
    duration: {
        type: Number, // in hours
        required: true
    },
    participantCount: {
        type: Number,
        required: true
    },
    role: {
        type: String,
        enum: ['organizer', 'coordinator', 'volunteer'],
        required: true
    },
    description: String,
    reportUrl: String,
    photosUrl: [String],
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Institutional Workshop/Seminar/Conference Schema
// For events conducted BY the institution (different from FDP/STTP attended by faculty)
const institutionalEventSchema = new mongoose.Schema({
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
        required: true
    },
    academicYear: {
        type: String,
        required: true
    },
    eventName: {
        type: String,
        required: true
    },
    eventType: {
        type: String,
        enum: ['workshop', 'seminar', 'conference'],
        required: true
    },
    participantCount: {
        type: Number,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    activityReportUrl: {
        type: String,
        required: false
    },
    description: String,
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'approved'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

export const ResearchPublication = mongoose.model('ResearchPublication', researchPublicationSchema);
export const ProfessionalDevelopment = mongoose.model('ProfessionalDevelopment', professionalDevelopmentSchema);
export const CourseTaught = mongoose.model('CourseTaught', courseTaughtSchema);
export const EventOrganized = mongoose.model('EventOrganized', eventOrganizedSchema);
export const InstitutionalEvent = mongoose.model('InstitutionalEvent', institutionalEventSchema);
