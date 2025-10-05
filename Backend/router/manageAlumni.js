// const express = require('express');
// const router = express.Router();
// const Alumni = require('../models/alumniSchema'); // Ensure this path is correct

// // --- GET: Fetch all alumni with intelligent, case-insensitive filtering ---
// router.get('/get-alumni', async (req, res) => {
//     try {
//         const stringSearchFields = ['name', 'StudentId', 'universityEmail', 'personalEmail', 'degreeProgram', 'profession', 'CompanyName'];
//         const query = {};

//         for (const key in req.query) {
//             // CRITICAL FIX: Use Object.prototype.hasOwnProperty.call() for safety
//             // This is the line that fixes the "hasOwnProperty is not a function" crash.
//             if (Object.prototype.hasOwnProperty.call(req.query, key) && req.query[key]) {
//                 if (stringSearchFields.includes(key)) {
//                     query[key] = { $regex: new RegExp(req.query[key], 'i') };
//                 } else {
//                     query[key] = req.query[key];
//                 }
//             }
//         }
        
//         const findAlumni = await Alumni.find(query);
//         res.status(200).json(findAlumni);
//     } catch (err) {
//         console.error("ERROR fetching alumni:", err); 
//         res.status(500).json({ message: "Unable to get alumni", error: err.message });
//     }
// });

// // --- POST: Add a new alumnus with duplicate handling ---
// router.post("/add-alumni", async (req, res) => {
//     try {
//         const createAlumni = await Alumni.create(req.body);
//         res.status(201).json(createAlumni);
//     } catch (err) {
//         if (err.code === 11000) {
//             return res.status(409).json({ message: "An alumnus with that Student ID or Email already exists." });
//         }
//         console.error("ERROR adding alumni:", err);
//         res.status(500).json({ message: "Failed to add the alumni", error: err.message });
//     }
// });

// // --- PUT: Update an existing alumnus by StudentId ---
// router.put('/update-alumni/:StudentId', async (req, res) => {
//     try {
//         const { StudentId } = req.params;
//         const updatedAlumni = await Alumni.findOneAndUpdate(
//             { StudentId: StudentId },
//             req.body,
//             { new: true, runValidators: true }
//         );

//         if (!updatedAlumni) {
//             return res.status(404).json({ message: "Alumni not found with that Student ID" });
//         }
//         res.status(200).json(updatedAlumni);
//     } catch (err) {
//         console.error("ERROR updating alumni:", err);
//         res.status(500).json({ message: "Unable to update the Alumni", error: err.message });
//     }
// });

// // --- DELETE: Delete an alumnus by StudentId ---
// router.delete('/delete-alumni/:StudentId', async (req, res) => {
//     try {
//         const { StudentId } = req.params;
//         const deletedAlumni = await Alumni.findOneAndDelete({ StudentId: StudentId });

//         if (!deletedAlumni) {
//             return res.status(44).json({ message: "Alumni with that Student ID not found." });
//         }
//         res.status(200).json({ message: "Alumni deleted successfully." });
//     } catch (err) {
//         console.error("ERROR deleting alumni:", err);
//         res.status(500).json({ message: "Unable to delete the Alumni", error: err.message });
//     }
// });

// router.get('/metadata', async (req, res) => {
//     try {
//         // Run all promises in parallel for maximum efficiency
//         const [batchYears, degreePrograms, genders, professions] = await Promise.all([
//             Alumni.distinct('batchYear'),
//             Alumni.distinct('degreeProgram'),
//             Alumni.distinct('gender'),
//             Alumni.distinct('profession')
//         ]);

//         res.status(200).json({
//             batchYears: batchYears.filter(Boolean).sort((a, b) => b - a), // Sort newest first
//             degreePrograms: degreePrograms.filter(Boolean).sort(),
//             genders: genders.filter(Boolean).sort(),
//             professions: professions.filter(Boolean).sort()
//         });
//     } catch (err) {
//         console.error("ERROR fetching metadata:", err);
//         res.status(500).json({ message: "Unable to get filter metadata", error: err.message });
//     }
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const Alumni = require('../models/alumniSchema'); // Ensure this path is correct
const multer = require('multer');
const xlsx = require('xlsx');
const cloudinary = require('cloudinary').v2;

// --- Multer Configuration for file uploads in memory ---
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// --- GET: Fetch alumni with robust, case-insensitive filtering ---
router.get('/get-alumni', async (req, res) => {
    try {
        const stringSearchFields = ['name', 'StudentId', 'universityEmail', 'personalEmail', 'degreeProgram', 'profession', 'CompanyName', 'nationality'];
        const query = {};
        for (const key in req.query) {
            if (Object.prototype.hasOwnProperty.call(req.query, key) && req.query[key]) {
                if (stringSearchFields.includes(key)) {
                    query[key] = { $regex: new RegExp(req.query[key], 'i') };
                } else {
                    query[key] = req.query[key];
                }
            }
        }
        const findAlumni = await Alumni.find(query);
        res.status(200).json(findAlumni);
    } catch (err) {
        console.error("ERROR fetching alumni:", err); 
        res.status(500).json({ message: "Unable to get alumni", error: err.message });
    }
});

// --- GET: Efficiently get unique values for all filter dropdowns ---
router.get('/metadata', async (req, res) => {
    try {
        const [batchYears, degreePrograms, genders, professions] = await Promise.all([
            Alumni.distinct('batchYear'),
            Alumni.distinct('degreeProgram'),
            Alumni.distinct('gender'),
            Alumni.distinct('profession')
        ]);
        res.status(200).json({
            batchYears: batchYears.filter(Boolean).sort((a, b) => b - a),
            degreePrograms: degreePrograms.filter(Boolean).sort(),
            genders: genders.filter(Boolean).sort(),
            professions: professions.filter(Boolean).sort()
        });
    } catch (err) {
        console.error("ERROR fetching metadata:", err);
        res.status(500).json({ message: "Unable to get filter metadata", error: err.message });
    }
});

// --- POST: Add a single new alumnus with duplicate handling ---
router.post("/add-alumni", async (req, res) => {
    try {
        const createAlumni = await Alumni.create(req.body);
        res.status(201).json(createAlumni);
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({ message: "An alumnus with that Student ID or Email already exists." });
        }
        console.error("ERROR adding alumni:", err);
        res.status(500).json({ message: "Failed to add the alumni", error: err.message });
    }
});

// --- POST: Bulk Upload Alumni from an Excel file ---
router.post('/upload', upload.single('alumniFile'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded." });
    }
    try {
        const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = xlsx.utils.sheet_to_json(worksheet);

        if (jsonData.length === 0) {
            return res.status(400).json({ message: "The Excel file is empty or formatted incorrectly." });
        }
        const result = await Alumni.insertMany(jsonData, { ordered: false });
        res.status(201).json({ message: `Successfully added ${result.length} new alumni.` });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({ message: `Partial success. Some alumni were added, but duplicates were found and ignored.` });
        }
        console.error("ERROR uploading file:", err);
        res.status(500).json({ message: "An error occurred during the upload process.", error: err.message });
    }
});

// --- PUT: Update an existing alumnus by StudentId ---
router.put('/update-alumni/:StudentId', async (req, res) => {
    try {
        const { StudentId } = req.params;
        const updatedAlumni = await Alumni.findOneAndUpdate(
            { StudentId: StudentId },
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedAlumni) {
            return res.status(404).json({ message: "Alumni not found with that Student ID" });
        }
        res.status(200).json(updatedAlumni);
    } catch (err) {
        console.error("ERROR updating alumni:", err);
        res.status(500).json({ message: "Unable to update the Alumni", error: err.message });
    }
});

// --- DELETE: Delete an alumnus by StudentId ---
router.delete('/delete-alumni/:StudentId', async (req, res) => {
    try {
        const { StudentId } = req.params;
        const deletedAlumni = await Alumni.findOneAndDelete({ StudentId: StudentId });
        if (!deletedAlumni) {
            return res.status(404).json({ message: "Alumni with that Student ID not found." });
        }
        res.status(200).json({ message: "Alumni deleted successfully." });
    } catch (err) {
        console.error("ERROR deleting alumni:", err);
        res.status(500).json({ message: "Unable to delete the Alumni", error: err.message });
    }
});

router.post('/upload-image', async (req, res) => {
    try {
        const { image } = req.body;
        if (!image) {
            return res.status(400).json({ message: "No image data provided." });
        }

        // Upload the image to Cloudinary
        const result = await cloudinary.uploader.upload(image, {
            folder: 'alumni_profiles', // Optional: saves images in a specific folder
            // You can add transformations here if you want
        });

        // Send back the secure URL
        res.status(200).json({ url: result.secure_url });

    } catch (err) {
        console.error("ERROR uploading image to Cloudinary:", err);
        res.status(500).json({ message: "Image upload failed.", error: err.message });
    }
});

module.exports = router;