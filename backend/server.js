
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB Connected Successfully!");
})
.catch((error) => {
    console.log("MongoDB Connection Failed:", error.message);
});

// Student Schema
const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    roll: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    size: {
        type: String,
        required: true,
        enum: ["S", "M", "L", "XL", "XXL"]
    }
}, {
    timestamps: true
});

const Student = mongoose.model("Student", studentSchema);

// Test API
app.get("/", (req, res) => {
    res.send("T-Shirt Backend Server Running!");
});

// Student Registration API

// Get All Students
app.get("/api/students", async (req, res) => {
    try {
        const students = await Student.find().sort({ createdAt: -1 });

        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({
            message: "Unable to fetch students"
        });
    }
});

// Update Student
app.put("/api/students/:id", async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.json({
            message: "Student updated successfully!",
            student
        });

    } catch (error) {
        res.status(400).json({
            message: "Update failed",
            error: error.message
        });
    }
});

// Delete Student
app.delete("/api/students/:id", async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.json({
            message: "Student deleted successfully!"
        });

    } catch (error) {
        res.status(500).json({
            message: "Delete failed"
        });
    }
});

app.post("/api/students", async (req, res) => {
    try {
        const { name, roll, email, phone, department, size } = req.body;

        if (!name || !roll || !email || !phone || !department || !size) {
            return res.status(400).json({
                message: "Please fill all fields!"
            });
        }

        const existingStudent = await Student.findOne({ roll });

        if (existingStudent) {
            return res.status(409).json({
                message: "Roll Number already registered!"
            });
        }

        const newStudent = new Student({
            name,
            roll,
            email,
            phone,
            department,
            size
        });

        await newStudent.save();

        res.status(201).json({
            message: "Registration Successful!",
            student: newStudent
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Registration Failed!",
            error: error.message
        });
    }
});

// Server Start
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
