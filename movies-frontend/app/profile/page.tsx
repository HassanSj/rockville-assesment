'use client';

import { useState, useEffect, useRef } from 'react';
import { api } from '@/services/api';
import Select from 'react-select';
import { useRouter } from 'next/navigation';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';

const ProfilePage = () => {
  useAuthRedirect();
  const [profile, setProfile] = useState({
    name: '',
    address: '',
    image: '',
    dob: '',
    categories: [] as string[],
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [dirty, setDirty] = useState(false);
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (dirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [dirty]);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/me', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = res.data;
      setProfile({
        ...data,
        dob: data.dob ? new Date(data.dob).toISOString().split('T')[0] : '',
      });
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  };

  const fetchAllCategories = async () => {
    try {
      const res = await api.get('/movies/categories');
      const names = res.data.map((c: any) => c.name);
      setAllCategories(names);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchAllCategories();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDirty(true);
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDirty(true);
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile((prev) => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCategoryRemove = (name: string) => {
    setDirty(true);
    setProfile((prev) => ({
      ...prev,
      categories: prev.categories.filter((c) => c !== name),
    }));
  };

  const handleCategoryAdd = (selected: any) => {
    const newCats = selected.map((s: any) => s.value);
    setDirty(true);
    setProfile((prev) => ({ ...prev, categories: newCats }));
  };

  const handleSubmit = async () => {
    try {
      let imageUrl = profile.image;

      if (imageFile) {
        const form = new FormData();
        form.append('file', imageFile);
        const res = await api.post('/upload', form, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        imageUrl = res.data.imageUrl;
      }

      await api.patch('/me', { ...profile, image: imageUrl }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      setDirty(false);
      alert('Profile updated successfully');
    } catch (err) {
      alert('Update failed');
    }
  };

  const selectedOptions = profile.categories.map((c) => ({ label: c, value: c }));
  const dropdownOptions = allCategories.map((c) => ({ label: c, value: c }));

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">👤 Update Your Profile</h2>

      <div className="flex flex-col items-center mb-6">
        {profile.image && (
          <img
            src={profile.image}
            alt="Profile"
            className="w-32 h-32 object-cover rounded-full shadow-md border-4 border-indigo-300"
          />
        )}

        <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="fileUpload" />
        <label htmlFor="fileUpload" className="mt-3 px-4 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition cursor-pointer text-sm">
          Change Profile Image
        </label>
      </div>

      <div className="space-y-4">
        <input
          name="name"
          placeholder="Name"
          value={profile.name}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2 text-black shadow-sm focus:ring"
        />

        <input
          name="address"
          placeholder="Address"
          value={profile.address}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2 text-black shadow-sm focus:ring"
        />

        <input
          name="dob"
          type="date"
          value={profile.dob}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2 text-black shadow-sm focus:ring"
        />

        <div>
          <p className="text-black font-medium mb-2">Your Categories:</p>
          <div className="flex flex-wrap gap-2">
            {profile.categories.map((cat) => (
              <div key={cat} className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                {cat}
                <button onClick={() => handleCategoryRemove(cat)} className="ml-2 text-red-500 hover:text-red-700">&times;</button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-black font-medium mt-4 mb-2">Add Categories:</p>
          <Select
            isMulti
            options={dropdownOptions}
            value={selectedOptions}
            onChange={handleCategoryAdd}
            className="text-black"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={!dirty}
          className={`w-full mt-4 py-2 font-semibold rounded-lg transition ${dirty ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
