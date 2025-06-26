'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Upload, MapPin, Phone, Mail, Building, Users, CreditCard, FileText, CheckCircle, X } from 'lucide-react';
import axios from 'axios';
import { createClient } from '@supabase/supabase-js'; // Import Supabase client creation function
// Initialize Supabase client directly in this file
const SUPABASE_URL = 'https://cdbffcudhtidbvqfsgqe.supabase.co'; // Replace with your Supabase URL
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkYmZmY3VkaHRpZGJ2cWZzZ3FlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5NDU5MTMsImV4cCI6MjA2NjUyMTkxM30.TMH2v5hu9uRD8DboTIZQgMPy7L_xeXipWAM0gq4_5Mk'; // Replace with your Supabase anon key
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const FitStartOnboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [partnerType, setPartnerType] = useState('gym');
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    // Gym Details
    gymName: '',
    openingTime: '',
    closingTime: '',
    gymPhotos: [],
    virtualTour: null,
    equipment: '',
    amenities: [],
    contactNumber: '',
    email: '',
    googleLocation: '',
    established: '',
    address: '',
    sessionPrice: '',
    
    // Owner Details
    ownerName: '',
    ownerMobile: '',
    ownerEmail: '',
    ownerIdProof: null,
    registrationCert: null,
    gstCert: null,
    msmeCert: null,
    
    // Bank Details
    upiId: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    
    // Trainer Details
    totalTrainers: '',
    trainers: [{ name: '', experience: '', workingHours: '' }],
    
    // Service Details
    serviceType: '',
    serviceTimings: '',
    servicePhotos: [],
    serviceAddress: '',
    serviceLocation: '',
    servicePrice: '',
    
    // Login
    loginEmail: '',
    password: '',
    confirmPassword: '',
    
    // Agreement
    agreedToTerms: false,
    agreedToAccuracy: false,
    signedAgreement: null
  });

  // Cloudinary configuration - Replace with your actual values
  const CLOUDINARY_CLOUD_NAME = 'jatinn';
  const CLOUDINARY_UPLOAD_PRESET = 'onboarding';

  const gymSteps = [
    { title: 'Partner Type', icon: Building },
    { title: 'Gym Details', icon: Building },
    { title: 'Owner Details', icon: Users },
    { title: 'Bank Details', icon: CreditCard },
    { title: 'Trainer Details', icon: Users },
    { title: 'Login Setup', icon: Mail },
    { title: 'Agreement', icon: FileText },
    { title: 'Complete', icon: CheckCircle }
  ];

  const serviceSteps = [
    { title: 'Partner Type', icon: Building },
    { title: 'Service Details', icon: Building },
    { title: 'Bank Details', icon: CreditCard },
    { title: 'Login Setup', icon: Mail },
    { title: 'Agreement', icon: FileText },
    { title: 'Complete', icon: CheckCircle }
  ];

  const steps = partnerType === 'gym' ? gymSteps : serviceSteps;
  const amenitiesList = ['AC', 'Showers', 'Locker', 'Wi-Fi', 'Parking', 'Steam Room', 'Sauna', 'Changing Room'];
  const serviceTypes = ['Yoga Studio', 'Zumba Classes', 'Swimming Pool', 'Steam Room', 'Ice Bath', 'Turf', 'Martial Arts', 'Dance Classes'];

  // Cloudinary upload function
  const uploadToCloudinary = async (file, resourceType = 'image') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('resource_type', resourceType);

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`,
        formData
      );
      return response.data.secure_url;
    } catch (error) {
      console.error('Upload failed:', error);
      throw error;
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAmenityToggle = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  // File upload handlers
  const handleFileUpload = async (files, fieldName, multiple = false) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      if (multiple) {
        const uploadPromises = Array.from(files).map(file => uploadToCloudinary(file));
        const urls = await Promise.all(uploadPromises);
        handleInputChange(fieldName, [...formData[fieldName], ...urls]);
      } else {
        const url = await uploadToCloudinary(files[0]);
        handleInputChange(fieldName, url);
      }
    } catch (error) {
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  // Trainer management functions
  const addTrainer = () => {
    setFormData(prev => ({
      ...prev,
      trainers: [...prev.trainers, { name: '', experience: '', workingHours: '' }]
    }));
  };

  const removeTrainer = (index) => {
    if (formData.trainers.length > 1) {
      setFormData(prev => ({
        ...prev,
        trainers: prev.trainers.filter((_, i) => i !== index)
      }));
    }
  };

  const updateTrainer = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      trainers: prev.trainers.map((trainer, i) => 
        i === index ? { ...trainer, [field]: value } : trainer
      )
    }));
  };

  const removePhoto = (fieldName, index) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: prev[fieldName].filter((_, i) => i !== index)
    }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const saveToSupabase = async () => {
    try {
      // Save form data to Supabase
      const { data, error } = await supabase
        .from('onboarding') 
        .insert([
          {
            partnerType: formData.partnerType,
      gymPhotos: formData.gymPhotos,
      servicePhotos: formData.servicePhotos,
      ownerIdProof: formData.ownerIdProof,
      registrationCert: formData.registrationCert,
      gstCert: formData.gstCert,
      msmeCert: formData.msmeCert,
      signedAgreement: formData.signedAgreement,
      gymName: formData.gymName,
      openingTime: formData.openingTime,
      closingTime: formData.closingTime,
      virtualTour: formData.virtualTour,
      equipment: formData.equipment,
      amenities: formData.amenities,
      contactNumber: formData.contactNumber,
      email: formData.email,
      googleLocation: formData.googleLocation,
      established: formData.established,
      address: formData.address,
      sessionPrice: Number(formData.sessionPrice),
      ownerName: formData.ownerName,
      ownerMobile: formData.ownerMobile,
      ownerEmail: formData.ownerEmail,
      upiId: formData.upiId,
      bankName: formData.bankName,
      accountNumber: formData.accountNumber,
      ifscCode: formData.ifscCode,
      totalTrainers: Number(formData.totalTrainers),
      trainers: formData.trainers,
      serviceType: formData.serviceType,
      serviceTimings: formData.serviceTimings,
      serviceAddress: formData.serviceAddress,
      serviceLocation: formData.serviceLocation,
      servicePrice: Number(formData.servicePrice),
      loginEmail: formData.loginEmail,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      agreedToTerms: Boolean(formData.agreedToTerms),
      agreedToAccuracy: Boolean(formData.agreedToAccuracy),
          },
        ]);

      if (error) {
        console.error('Error saving data:', error);
        alert('Failed to save data. Please try again.');
      } else {
        console.log('Data saved successfully:', data);
        alert('Data saved successfully!');
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      alert('An unexpected error occurred.');
    }
  };

  const renderPartnerTypeStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Choose Your Partnership Type</h2>
        <p className="text-gray-600">Select the type of fitness service you want to offer</p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
            partnerType === 'gym' 
              ? 'border-[#2c2c2c] bg-[#2c2c2c] text-white' 
              : 'border-gray-200 hover:border-[#bfff00]'
          }`}
          onClick={() => setPartnerType('gym')}
        >
          <Building className="w-12 h-12 text-[#BFFF00] mb-4" />
          <h3 className="text-xl font-semibold mb-2">Gym Partner</h3>
          <p className={partnerType === 'gym' ? 'text-gray-300' : 'text-gray-600'}>
            Full-service gym with equipment, trainers, and comprehensive facilities
          </p>
        </motion.div>
        
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
            partnerType === 'service' 
              ? 'border-[#2c2c2c] bg-[#2c2c2c] text-white' 
              : 'border-gray-200 hover:border-[#bfff00]'
          }`}
          onClick={() => setPartnerType('service')}
        >
          <Users className="w-12 h-12 text-[#BFFF00] mb-4" />
          <h3 className="text-xl font-semibold mb-2">Service Partner</h3>
          <p className={partnerType === 'service' ? 'text-gray-300' : 'text-gray-600'}>
            Specialized services like yoga, swimming, turf, or other fitness activities
          </p>
        </motion.div>
      </div>
    </motion.div>
  );

  const renderGymDetailsStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Gym Details</h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Gym Name *</label>
          <input
            type="text"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2c2c2c] focus:border-transparent"
            value={formData.gymName}
            onChange={(e) => handleInputChange('gymName', e.target.value)}
            placeholder="Enter gym name"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Established Since *</label>
          <input
            type="number"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2c2c2c] focus:border-transparent"
            value={formData.established}
            onChange={(e) => handleInputChange('established', e.target.value)}
            placeholder="Year"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Opening Time *</label>
          <input
            type="time"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2c2c2c] focus:border-transparent"
            value={formData.openingTime}
            onChange={(e) => handleInputChange('openingTime', e.target.value)}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Closing Time *</label>
          <input
            type="time"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2c2c2c] focus:border-transparent"
            value={formData.closingTime}
            onChange={(e) => handleInputChange('closingTime', e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Complete Address *</label>
        <textarea
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2c2c2c] focus:border-transparent"
          rows="3"
          value={formData.address}
          onChange={(e) => handleInputChange('address', e.target.value)}
          placeholder="Enter complete gym address"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number *</label>
          <input
            type="tel"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2c2c2c] focus:border-transparent"
            value={formData.contactNumber}
            onChange={(e) => handleInputChange('contactNumber', e.target.value)}
            placeholder="+91 XXXXXXXXXX"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email ID *</label>
          <input
            type="email"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2c2c2c] focus:border-transparent"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="gym@example.com"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Google Location Link</label>
        <input
          type="url"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2c2c2c] focus:border-transparent"
          value={formData.googleLocation}
          onChange={(e) => handleInputChange('googleLocation', e.target.value)}
          placeholder="https://maps.google.com/..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Per Session Price (₹) *</label>
        <input
          type="number"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2c2c2c] focus:border-transparent"
          value={formData.sessionPrice}
          onChange={(e) => handleInputChange('sessionPrice', e.target.value)}
          placeholder="500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Equipment Details</label>
        <textarea
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2c2c2c] focus:border-transparent"
          rows="4"
          value={formData.equipment}
          onChange={(e) => handleInputChange('equipment', e.target.value)}
          placeholder="List all available gym equipment (e.g., Treadmills, Dumbbells, Bench Press, etc.)"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Available Amenities</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {amenitiesList.map((amenity) => (
            <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-[#BFFF00] focus:ring-[#2c2c2c]"
                checked={formData.amenities.includes(amenity)}
                onChange={() => handleAmenityToggle(amenity)}
              />
              <span className="text-sm text-gray-700">{amenity}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Gym Photos *</label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#bfff00] transition-colors">
          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600 mb-2">Upload 5-10 photos of your gym</p>
          <input 
            type="file" 
            multiple 
            accept="image/*" 
            onChange={(e) => handleFileUpload(e.target.files, 'gymPhotos', true)}
            className="hidden" 
            id="gym-photos"
            disabled={uploading}
          />
          <label 
            htmlFor="gym-photos" 
            className="cursor-pointer bg-[#BFFF00] text-white px-4 py-2 rounded-lg hover:bg-[#bfff00] transition-colors"
          >
            {uploading ? 'Uploading...' : 'Choose Files'}
          </label>
        </div>
        
        {formData.gymPhotos.length > 0 && (
          <div className="mt-4 grid grid-cols-3 gap-4">
            {formData.gymPhotos.map((photo, index) => (
              <div key={index} className="relative">
                <img src={photo} alt={`Gym ${index + 1}`} className="w-full h-24 object-cover rounded-lg" />
                <button
                  onClick={() => removePhoto('gymPhotos', index)}
                  className="absolute  -top-2 -right-2 bg-red-500 cursor-pointer text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );

  const renderOwnerDetailsStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Owner Details</h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
        <input
          type="text"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2c2c2c] focus:border-transparent"
          value={formData.ownerName}
          onChange={(e) => handleInputChange('ownerName', e.target.value)}
          placeholder="Enter full name"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number *</label>
          <input
            type="tel"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2c2c2c] focus:border-transparent"
            value={formData.ownerMobile}
            onChange={(e) => handleInputChange('ownerMobile', e.target.value)}
            placeholder="+91 XXXXXXXXXX"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email ID *</label>
          <input
            type="email"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2c2c2c] focus:border-transparent"
            value={formData.ownerEmail}
            onChange={(e) => handleInputChange('ownerEmail', e.target.value)}
            placeholder="owner@example.com"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Government Photo ID Proof *</label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#bfff00] transition-colors">
          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600 mb-2">Upload Aadhaar / PAN / Voter ID / Passport</p>
          <input 
            type="file" 
            accept="image/*,.pdf" 
            onChange={(e) => handleFileUpload(e.target.files, 'ownerIdProof')}
            className="hidden" 
            id="id-proof"
            disabled={uploading}
          />
          <label 
            htmlFor="id-proof" 
            className="cursor-pointer bg-[#BFFF00] text-white px-4 py-2 rounded-lg hover:bg-[#bfff00] transition-colors"
          >
            {uploading ? 'Uploading...' : 'Choose File'}
          </label>
        </div>
        {formData.ownerIdProof && (
          <div className="mt-2 text-sm text-green-600">✓ ID Proof uploaded successfully</div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Registration Documents *</label>
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[#bfff00] transition-colors">
            <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1" />
            <p className="text-sm text-gray-600 mb-2">Gym Registration Certificate / Trade License</p>
            <input 
              type="file" 
              accept="image/*,.pdf" 
              onChange={(e) => handleFileUpload(e.target.files, 'registrationCert')}
              className="hidden" 
              id="reg-cert"
              disabled={uploading}
            />
            <label 
              htmlFor="reg-cert" 
              className="cursor-pointer bg-[#BFFF00] text-white px-3 py-1 rounded text-sm hover:bg-[#bfff00] transition-colors"
            >
              {uploading ? 'Uploading...' : 'Choose File'}
            </label>
            {formData.registrationCert && (
              <div className="mt-1 text-xs text-green-600">✓ Uploaded</div>
            )}
          </div>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[#bfff00] transition-colors">
            <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1" />
            <p className="text-sm text-gray-600 mb-2">GST Certificate (Optional)</p>
            <input 
              type="file" 
              accept="image/*,.pdf" 
              onChange={(e) => handleFileUpload(e.target.files, 'gstCert')}
              className="hidden" 
              id="gst-cert"
              disabled={uploading}
            />
            <label 
              htmlFor="gst-cert" 
              className="cursor-pointer bg-[#BFFF00] text-white px-3 py-1 rounded text-sm hover:bg-[#bfff00] transition-colors"
            >
              {uploading ? 'Uploading...' : 'Choose File'}
            </label>
            {formData.gstCert && (
              <div className="mt-1 text-xs text-green-600">✓ Uploaded</div>
            )}
          </div>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[#bfff00] transition-colors">
            <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1" />
            <p className="text-sm text-gray-600 mb-2">MSME Certificate (If available)</p>
            <input 
              type="file" 
              accept="image/*,.pdf" 
              onChange={(e) => handleFileUpload(e.target.files, 'msmeCert')}
              className="hidden" 
              id="msme-cert"
              disabled={uploading}
            />
            <label 
              htmlFor="msme-cert" 
              className="cursor-pointer bg-[#BFFF00] text-white px-3 py-1 rounded text-sm hover:bg-[#bfff00] transition-colors"
            >
              {uploading ? 'Uploading...' : 'Choose File'}
            </label>
            {formData.msmeCert && (
              <div className="mt-1 text-xs text-green-600">✓ Uploaded</div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderBankDetailsStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Bank Details</h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">UPI ID *</label>
        <input
          type="text"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2c2c2c] focus:border-transparent"
          value={formData.upiId}
          onChange={(e) => handleInputChange('upiId', e.target.value)}
          placeholder="yourname@paytm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name *</label>
        <input
          type="text"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2c2c2c] focus:border-transparent"
          value={formData.bankName}
          onChange={(e) => handleInputChange('bankName', e.target.value)}
          placeholder="State Bank of India"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Account Number *</label>
          <input
            type="text"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2c2c2c] focus:border-transparent"
            value={formData.accountNumber}
            onChange={(e) => handleInputChange('accountNumber', e.target.value)}
            placeholder="XXXXXXXXXXXXXXXX"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">IFSC Code *</label>
          <input
            type="text"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2c2c2c] focus:border-transparent"
            value={formData.ifscCode}
            onChange={(e) => handleInputChange('ifscCode', e.target.value)}
            placeholder="SBIN0000XXX"
          />
        </div>
      </div>
    </motion.div>
  );

  const renderTrainerDetailsStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Trainer Details</h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Total Number of Trainers *</label>
        <input
          type="number"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2c2c2c] focus:border-transparent"
          value={formData.totalTrainers}
          onChange={(e) => handleInputChange('totalTrainers', e.target.value)}
          placeholder="5"
        />
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Trainer Information</h3>
        <p className="text-sm text-gray-600 mb-4">Add details for each trainer at your gym</p>
        
        <div className="space-y-4">
          {formData.trainers.map((trainer, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 bg-white">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-gray-800">Trainer {index + 1}</h4>
                {formData.trainers.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTrainer(index)}
                    className="text-red-500 cursor-pointer hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                )}
              </div>
              
              <div className="grid md:grid-cols-3 gap-4">
                <input
                  type="text"
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2c2c2c] focus:border-transparent"
                  placeholder="Trainer Name"
                  value={trainer.name}
                  onChange={(e) => updateTrainer(index, 'name', e.target.value)}
                />
                <input
                  type="number"
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2c2c2c] focus:border-transparent"
                  placeholder="Years of Experience"
                  value={trainer.experience}
                  onChange={(e) => updateTrainer(index, 'experience', e.target.value)}
                />
                <input
                  type="text"
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2c2c2c] focus:border-transparent"
                  placeholder="Working Hours"
                  value={trainer.workingHours}
                  onChange={(e) => updateTrainer(index, 'workingHours', e.target.value)}
                />
              </div>
            </div>
          ))}
          
          <button
            type="button"
            onClick={addTrainer}
            className="text-[#BFFF00] cursor-pointer text-sm font-medium hover:text-[#bfff00] bg-gray-700 px-4 py-2 rounded-lg border border-dashed border-gray-300 w-full hover:bg-gray-700 transition-colors"
          >
            + Add Another Trainer
          </button>
        </div>
      </div>
    </motion.div>
  );

  const renderServiceDetailsStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Service Details</h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Service Type *</label>
        <select
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2c2c2c] focus:border-transparent"
          value={formData.serviceType}
          onChange={(e) => handleInputChange('serviceType', e.target.value)}
        >
          <option value="">Select service type</option>
          {serviceTypes.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Service Timings *</label>
        <input
          type="text"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2c2c2c] focus:border-transparent"
          value={formData.serviceTimings}
          onChange={(e) => handleInputChange('serviceTimings', e.target.value)}
          placeholder="Morning: 6:00 AM - 10:00 AM, Evening: 5:00 PM - 9:00 PM"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Service Address *</label>
        <textarea
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2c2c2c] focus:border-transparent"
          rows={3}
          value={formData.serviceAddress}
          onChange={(e) => handleInputChange('serviceAddress', e.target.value)}
          placeholder="Enter complete service address"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Google Location Link</label>
        <input
          type="url"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2c2c2c] focus:border-transparent"
          value={formData.serviceLocation}
          onChange={(e) => handleInputChange('serviceLocation', e.target.value)}
          placeholder="https://maps.google.com/..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Session Price (₹) *</label>
        <input
          type="number"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2c2c2c] focus:border-transparent"
          value={formData.servicePrice}
          onChange={(e) => handleInputChange('servicePrice', e.target.value)}
          placeholder="300"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Service Photos *</label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#bfff00] transition-colors">
          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600 mb-2">Upload 3-5 photos of your service</p>
          <input 
            type="file" 
            multiple 
            accept="image/*" 
            onChange={(e) => handleFileUpload(e.target.files, 'servicePhotos', true)}
            className="hidden" 
            id="service-photos"
            disabled={uploading}
          />
          <label 
            htmlFor="service-photos" 
            className="cursor-pointer bg-[#BFFF00] text-white px-4 py-2 rounded-lg hover:bg-[#bfff00] transition-colors"
          >
            {uploading ? 'Uploading...' : 'Choose Files'}
          </label>
        </div>
        
        {formData.servicePhotos.length > 0 && (
          <div className="mt-4 grid grid-cols-3 gap-4">
            {formData.servicePhotos.map((photo, index) => (
              <div key={index} className="relative">
                <img src={photo} alt={`Service ${index + 1}`} className="w-full h-24 object-cover rounded-lg" />
                <button
                  onClick={() => removePhoto('servicePhotos', index)}
                  className="absolute -top-2 cursor-pointer -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );

  const renderLoginSetupStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Login Setup</h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Email ID *</label>
        <input
          type="email"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2c2c2c] focus:border-transparent"
          value={formData.loginEmail}
          onChange={(e) => handleInputChange('loginEmail', e.target.value)}
          placeholder="your@email.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Set Password *</label>
        <input
          type="password"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2c2c2c] focus:border-transparent"
          value={formData.password}
          onChange={(e) => handleInputChange('password', e.target.value)}
          placeholder="Create a strong password"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password *</label>
        <input
          type="password"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2c2c2c] focus:border-transparent"
          value={formData.confirmPassword}
          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
          placeholder="Confirm your password"
        />
      </div>

      <div className="bg-[#2c2c2c] border border-teal-200 rounded-lg p-4">
        <p className="text-sm text-[#bfff00]">
          <strong>Note:</strong> After completing registration, an OTP will be sent to your email for verification.
        </p>
      </div>
    </motion.div>
  );

  const renderAgreementStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Agreement & Terms</h2>
      
      <div className="bg-gray-50 border rounded-lg p-6 max-h-96 overflow-y-auto">
        <h3 className="font-semibold mb-4">FitStart Partner Agreement</h3>
        <div className="text-sm text-gray-700 space-y-3">
          <p>By becoming a FitStart partner, you agree to the following terms and conditions:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>Maintain high standards of service quality and cleanliness</li>
            <li>Provide accurate information about facilities and services</li>
            <li>Honor all bookings made through the FitStart platform</li>
            <li>Comply with local health and safety regulations</li>
            <li>Pay applicable commission fees as per the agreement</li>
            <li>Maintain proper insurance coverage for your facility</li>
            <li>Provide timely customer support to FitStart users</li>
          </ul>
          <p>For complete terms and conditions, please refer to the detailed partner agreement document.</p>
        </div>
      </div>

      <div className="space-y-4">
        <label className="flex items-start space-x-3 cursor-pointer">
          <input
            type="checkbox"
            className="mt-1 rounded border-gray-300 text-[#BFFF00] focus:ring-[#2c2c2c]"
            checked={formData.agreedToTerms}
            onChange={(e) => handleInputChange('agreedToTerms', e.target.checked)}
          />
          <span className="text-sm text-gray-700">
            I agree to the FitStart Partner Agreement and Terms & Conditions *
          </span>
        </label>

        <label className="flex items-start space-x-3 cursor-pointer">
          <input
            type="checkbox"
            className="mt-1 rounded border-gray-300 text-[#BFFF00] focus:ring-[#2c2c2c]"
            checked={formData.agreedToAccuracy}
            onChange={(e) => handleInputChange('agreedToAccuracy', e.target.checked)}
          />
          <span className="text-sm text-gray-700">
            I confirm that all information provided is accurate and up-to-date *
          </span>
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Upload Signed Agreement (PDF/Image)</label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#bfff00] transition-colors">
          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600 mb-2">Upload signed partner agreement document</p>
          <input 
            type="file" 
            accept=".pdf,.jpg,.jpeg,.png" 
            onChange={(e) => handleFileUpload(e.target.files, 'signedAgreement')}
            className="hidden" 
            id="signed-agreement"
            disabled={uploading}
          />
          <label 
            htmlFor="signed-agreement" 
            className="cursor-pointer bg-[#BFFF00] text-white px-4 py-2 rounded-lg hover:bg-[#bfff00] transition-colors"
          >
            {uploading ? 'Uploading...' : 'Choose File'}
          </label>
        </div>
        {formData.signedAgreement && (
          <div className="mt-2 text-sm text-green-600">✓ Agreement uploaded successfully</div>
        )}
      </div>
    </motion.div>
  );

  const renderCompleteStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-12"
    >
      <CheckCircle className="w-16 h-16 text-[#2c2c2c] mx-auto mb-6" />
      <h2 className="text-3xl font-bold text-gray-900 mb-4">
        {partnerType === 'gym' 
          ? 'Welcome to FitStart!'
          : 'Welcome to FitStart Services!'}
      </h2>
      <p className="text-lg text-gray-600 mb-8">
        {partnerType === 'gym'
          ? 'Your gym account is successfully created and pending verification.'
          : 'You are now a verified service partner with FitStart.'}
      </p>
      <p className="text-gray-500 mb-8">
        Our team will review your application and contact you within 24-48 hours.
        You'll receive a confirmation email once your account is approved.
      </p>
      <button
        className="px-8 py-3 bg-[#BFFF00] cursor-pointer text-white rounded-lg font-medium hover:bg-[#bfff00] transition-colors"
        onClick={async () => {
          console.log('Form Data:', formData);
          await saveToSupabase(); // Save data to Supabase
          alert('Registration completed successfully!');
        }}
      >
        Go to Dashboard
      </button>
    </motion.div>
  );

  const renderStepContent = () => {
    if (partnerType === 'gym') {
      switch (currentStep) {
        case 0: return renderPartnerTypeStep();
        case 1: return renderGymDetailsStep();
        case 2: return renderOwnerDetailsStep();
        case 3: return renderBankDetailsStep();
        case 4: return renderTrainerDetailsStep();
        case 5: return renderLoginSetupStep();
        case 6: return renderAgreementStep();
        case 7: return renderCompleteStep();
        default: return null;
      }
    } else {
      switch (currentStep) {
        case 0: return renderPartnerTypeStep();
        case 1: return renderServiceDetailsStep();
        case 2: return renderBankDetailsStep();
        case 3: return renderLoginSetupStep();
        case 4: return renderAgreementStep();
        case 5: return renderCompleteStep();
        default: return null;
      }
    }
  };

  return (
    <div className="min-h-screen mt-12 bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        {/* Progress Bar */}
        <div className="px-8 pt-8">
          <div className="mb-8">
            <div className="flex justify-between flex-wrap gap-2 items-center mb-2">
              {steps.map((step, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      currentStep >= index
                        ? 'bg-[#BFFF00] text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    <step.icon className="w-5 h-5" />
                  </div>
                  <span
                    className={`text-xs mt-2 ${
                      currentStep >= index ? 'text-[#BFFF00] font-medium' : 'text-gray-500'
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
              ))}
            </div>
            <div className="relative">
              <div className="absolute top-1/2 h-1 bg-gray-200 w-full -z-10"></div>
              <div
                className="absolute top-1/2 h-1 bg-[#BFFF00] -z-10 transition-all duration-300"
                style={{
                  width: `${(currentStep / (steps.length - 1)) * 100}%`
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="px-8 py-6">
          <AnimatePresence mode="wait">
            {renderStepContent()}
          </AnimatePresence>
        </div>

        {/* Navigation Buttons */}
        {currentStep < steps.length - 1 && (
          <div className="px-8 py-6 bg-gray-50 border-t border-gray-200 flex justify-between">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 0}
              className={`px-6 py-2 rounded-full cursor-pointer flex items-center space-x-2 ${
                currentStep === 0
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
            
            <button
              type="button"
              onClick={nextStep}
              disabled={uploading}
              className="px-6 py-2 bg-[#BFFF00] cursor-pointer text-white rounded-full hover:bg-[#bfff00] flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{currentStep === steps.length - 2 ? 'Submit' : 'Next'}</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FitStartOnboarding;
