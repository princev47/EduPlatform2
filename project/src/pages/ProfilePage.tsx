import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { getMyProfile, updateProfile } from '../api/profile'
import { User, Mail, Phone, Calendar, FileText, Save, Loader2 } from 'lucide-react'

export default function ProfilePage() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('ProfilePage must be used within AuthProvider')
  
  const { user, setUser } = context
  const [form, setForm] = useState({
    dateOfBirth: '',
    about: '',
    contactNumber: '',
    gender: ''
  })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (user) {
      setForm({
        dateOfBirth: user.additionalDetails?.dateOfBirth || '',
        about: user.additionalDetails?.about || '',
        contactNumber: user.additionalDetails?.contactNumber || '',
        gender: user.additionalDetails?.gender || ''
      })
    }
  }, [user])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    setSuccess('')

    try {
      await updateProfile(form)
      
      // Refresh profile data
      const me = await getMyProfile()
      setUser(me.data.data || me.data)
      setSuccess('Profile updated successfully!')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-white text-2xl font-bold">
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </span>
        </div>
        <h1 className="text-3xl font-bold gradient-text mb-2">My Profile</h1>
        <p className="text-gray-600">Manage your personal information</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Basic Info Card */}
        <div className="glass-card p-6 rounded-xl">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="font-medium text-gray-900">{user?.firstName} {user?.lastName}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Mail className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-gray-900">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <User className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Account Type</p>
                <p className="font-medium text-gray-900">{user?.accountType}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="lg:col-span-2">
          <form onSubmit={submit} className="glass-card p-8 rounded-xl space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Additional Details</h2>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                {success}
              </div>
            )}

            {/* Contact Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="tel"
                  value={form.contactNumber}
                  onChange={(e) => setForm({...form, contactNumber: e.target.value})}
                  placeholder="Enter your contact number"
                  className="input-field pl-10"
                />
              </div>
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender
              </label>
              <select
                value={form.gender}
                onChange={(e) => setForm({...form, gender: e.target.value})}
                className="input-field"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="date"
                  value={form.dateOfBirth}
                  onChange={(e) => setForm({...form, dateOfBirth: e.target.value})}
                  className="input-field pl-10"
                />
              </div>
            </div>

            {/* About */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                About Me
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
                <textarea
                  value={form.about}
                  onChange={(e) => setForm({...form, about: e.target.value})}
                  placeholder="Tell us about yourself..."
                  rows={4}
                  className="input-field pl-10 resize-none"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={busy}
                className="btn-primary flex items-center space-x-2"
              >
                {busy ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}