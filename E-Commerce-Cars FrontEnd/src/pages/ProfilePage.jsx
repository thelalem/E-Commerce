import React, { useEffect, useState } from "react";
import axiosClient from "../utils/axios";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { FiEdit, FiUser, FiMail, FiMapPin, FiCamera, FiX, FiCheck } from "react-icons/fi";

const ProfilePage = () => {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    profilePicture: "",
  });
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await axiosClient.get(`/users/${currentUser.id}`);
        setProfile(res.data);
        setFormData({
          name: res.data.name || "",
          email: res.data.email || "",
          address: res.data.address || "",
          profilePicture: res.data.profilePicture || "",
        });
        if (res.data.profilePicture) {
          setProfilePicturePreview(`${import.meta.env.VITE_API_URL}${res.data.profilePicture}`);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchProfile();
    }
  }, [currentUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePictureFile(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicturePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("email", formData.email);
      payload.append("address", formData.address);
      if (profilePictureFile) {
        payload.append("profilePicture", profilePictureFile);
      }

      const res = await axiosClient.put(`/users/${currentUser.id}`, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setProfile(res.data);
      setEditing(false);
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error(err.response?.data?.message || "Failed to update profile. Please try again.");
    }
  };

  const handleCancelEdit = () => {
    setEditing(false);
    setFormData({
      name: profile.name || "",
      email: profile.email || "",
      address: profile.address || "",
      profilePicture: profile.profilePicture || "",
    });
    setProfilePictureFile(null);
    setProfilePicturePreview(profile.profilePicture ? `${import.meta.env.VITE_API_URL}${profile.profilePicture}` : "");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-blue-100 rounded-full mb-4"></div>
          <p className="text-blue-600 font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="text-center p-6 bg-red-50 rounded-lg max-w-md w-full">
          <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiX className="text-red-500 text-xl" />
          </div>
          <h2 className="text-lg font-semibold text-gray-800">Error Loading Profile</h2>
          <p className="text-gray-600 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-blue-800">Your Profile</h1>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiEdit /> Edit Profile
          </button>
        )}
      </div>

      {profile && (
        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
          {editing ? (
            <div className="p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column - Profile Picture */}
                <div className="flex flex-col items-center">
                  <div className="relative mb-4">
                    <div className="w-32 h-32 rounded-full bg-gray-100 overflow-hidden border-4 border-blue-50">
                      {profilePicturePreview ? (
                        <img
                          src={profilePicturePreview}
                          alt="Profile preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <FiUser className="text-4xl" />
                        </div>
                      )}
                    </div>
                    <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700">
                      <FiCamera className="text-lg" />
                      <input
                        type="file"
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/*"
                      />
                    </label>
                  </div>
                  <p className="text-sm text-gray-500 text-center">
                    Click the camera icon to change your profile picture
                  </p>
                </div>

                {/* Right Column - Form Fields */}
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <FiUser /> Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <FiMail /> Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                      disabled
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <FiMapPin /> Address
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows="3"
                      placeholder="Enter your full address"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={handleCancelEdit}
                  className="flex items-center gap-2 bg-gray-200 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  <FiX /> Cancel
                </button>
                <button
                  onClick={handleUpdateProfile}
                  className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FiCheck /> Save Changes
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Profile Picture */}
                <div className="flex flex-col items-center md:items-start">
                  <div className="w-40 h-40 rounded-full bg-gray-100 overflow-hidden border-4 border-blue-50 mb-4">
                    {profile.profilePicture ? (
                      <img
                        src={`${import.meta.env.VITE_API_URL}${profile.profilePicture}`}
                        alt="Profile"
                        className="w-full h-full object-cover"
                        crossOrigin="anonymous"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <FiUser className="text-6xl" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Profile Details */}
                <div className="md:col-span-2">
                  <div className="space-y-4">
                    <div className="border-b border-gray-100 pb-4">
                      <h2 className="text-2xl font-bold text-gray-800">{profile.name}</h2>
                      <p className="text-gray-500">{profile.email}</p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="bg-blue-50 p-2 rounded-lg">
                          <FiMapPin className="text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Address</h3>
                          <p className="text-gray-700">
                            {profile.address || (
                              <span className="text-gray-400">Not provided</span>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;