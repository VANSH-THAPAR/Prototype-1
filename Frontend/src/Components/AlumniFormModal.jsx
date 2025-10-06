import React, { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

// --- Reusable Input Component for a cleaner form structure ---
const FormInput = ({ label, name, value, onChange, ...props }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
        <input id={name} name={name} value={value || ''} onChange={onChange} className="form-input" {...props} />
    </div>
);

// --- The Image Uploader Component ---
const ImageUploader = ({ profilePicture, onUpload }) => {
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState('');

    const onDrop = useCallback(acceptedFiles => {
        const file = acceptedFiles[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async () => {
            const base64Image = reader.result;
            setLoading(true);
            try {
                const response = await fetch(`${import.meta.env.VITE_backend_url}/upload-image`, { // Ensure port is correct
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ image: base64Image })
                });
                const data = await response.json();
                if (!response.ok) throw new Error(data.message || 'Upload failed');
                onUpload(data.url); // Pass the new URL up to the parent form
            } catch (err) {
                alert(`Error: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };
        reader.readAsDataURL(file);
    }, [onUpload]);

    const handleUrlUpload = () => {
        if (imageUrl) {
            onUpload(imageUrl); // Pass the URL up to the parent form
            setImageUrl('');
        }
    };
    
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: {'image/*': ['.jpeg', '.png', '.jpg']} });

    return (
        <div className="flex flex-col items-center">
            <div className="w-48 h-48 rounded-full overflow-hidden bg-slate-200 mb-4 flex items-center justify-center border-4 border-white shadow-md">
                {profilePicture ? (
                    <img src={profilePicture} alt="Profile Preview" className="w-full h-full object-cover" />
                ) : (
                    <span className="text-slate-500 text-sm p-4 text-center">Image Preview</span>
                )}
            </div>

            <div {...getRootProps()} className={`w-full p-6 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${isDragActive ? 'border-indigo-600 bg-indigo-50' : 'border-slate-300 hover:border-indigo-500'}`}>
                <input {...getInputProps()} />
                {loading ? <p>Uploading...</p> : (isDragActive ? <p>Drop the image here...</p> : <p>Drag & drop or click to select</p>)}
            </div>
            
            <div className="text-center text-slate-500 my-4">or</div>

            <div className="w-full flex space-x-2">
                <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="Paste image URL" className="form-input flex-grow" />
                <button type="button" onClick={handleUrlUpload} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">Set</button>
            </div>
        </div>
    );
};


// --- The Complete and Redesigned AlumniFormModal ---
const AlumniFormModal = ({ isOpen, onClose, onSubmit, initialData }) => {
    const isEditing = Boolean(initialData);
    
    // --- Complete initial state with all fields from your schema ---
    const initialFormState = {
        name: '', StudentId: '', universityEmail: '', personalEmail: '',
        contactNumber: '', fatherName: '', motherName: '', nationality: '',
        gender: '', role: 'Alumni', ProfilePicture: '', dob: '',
        profession: '', CompanyName: '', batchYear: '', degreeProgram: '', LinkedInURL: ''
    };

    const [formData, setFormData] = useState(initialFormState);

    // --- Complete useEffect to populate form data ---
    useEffect(() => {
        if (isOpen) {
            // If editing, populate with existing data, otherwise use the clean initial state
            setFormData(isEditing ? initialData : initialFormState);
        }
    }, [isOpen, initialData, isEditing]);

    // --- Complete handleChange function ---
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[95vh] flex flex-col">
                <div className="p-6 border-b">
                    <h2 className="text-2xl font-bold text-slate-800">{isEditing ? 'Edit Alumni Record' : 'Add New Alumni'}</h2>
                </div>
                
                <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Column 1: Image Uploader */}
                        <div className="lg:col-span-1">
                            <ImageUploader 
                                profilePicture={formData.ProfilePicture} 
                                onUpload={(url) => setFormData(prev => ({ ...prev, ProfilePicture: url }))}
                            />
                        </div>
                        
                        {/* Columns 2 & 3: Form Fields */}
                        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                            <h3 className="md:col-span-2 text-lg font-semibold text-slate-700 border-b pb-2 mb-2">Personal Details</h3>
                            <FormInput label="Full Name" name="name" value={formData.name} onChange={handleChange} required />
                            <FormInput label="Date of Birth" name="dob" value={formData.dob ? formData.dob.split('T')[0] : ''} onChange={handleChange} type="date" />
                            <FormInput label="Contact Number" name="contactNumber" value={formData.contactNumber} onChange={handleChange} />
                            <FormInput label="Personal Email" name="personalEmail" value={formData.personalEmail} onChange={handleChange} type="email" />
                            <div>
                                <label htmlFor="gender" className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
                                <select id="gender" name="gender" value={formData.gender} onChange={handleChange} className="form-input">
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <FormInput label="Nationality" name="nationality" value={formData.nationality} onChange={handleChange} />
                            <FormInput label="Father's Name" name="fatherName" value={formData.fatherName} onChange={handleChange} />
                            <FormInput label="Mother's Name" name="motherName" value={formData.motherName} onChange={handleChange} />
                            
                            <h3 className="md:col-span-2 text-lg font-semibold text-slate-700 border-b pb-2 mt-6 mb-2">Academic & Professional Details</h3>
                            <FormInput label="Student ID" name="StudentId" value={formData.StudentId} onChange={handleChange} required disabled={isEditing} />
                            <FormInput label="University Email" name="universityEmail" value={formData.universityEmail} onChange={handleChange} type="email" required />
                            <FormInput label="Batch Year" name="batchYear" value={formData.batchYear} onChange={handleChange} placeholder="e.g., 2024" required />
                            <FormInput label="Degree Program" name="degreeProgram" value={formData.degreeProgram} onChange={handleChange} required />
                            <FormInput label="Profession" name="profession" value={formData.profession} onChange={handleChange} />
                            <FormInput label="Company Name" name="CompanyName" value={formData.CompanyName} onChange={handleChange} />
                            <div className="md:col-span-2">
                                <FormInput label="LinkedIn Profile URL" name="LinkedInURL" value={formData.LinkedInURL} onChange={handleChange} />
                            </div>
                        </div>
                    </div>
                </form>

                <div className="p-4 bg-slate-50 border-t flex justify-end space-x-3 rounded-b-2xl">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-200 rounded-lg hover:bg-slate-300">Cancel</button>
                    <button type="submit" onClick={handleSubmit} className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-sm">{isEditing ? 'Save Changes' : 'Add Alumni'}</button>
                </div>
            </div>
        </div>
    );
};

export default AlumniFormModal;