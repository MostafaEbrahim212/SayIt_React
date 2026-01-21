// src/pages/EditProfile.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import API from "../../services/axiosInstance";
import { useToast } from "../../context/ToastContext";
import { useTranslation } from "react-i18next";
import UserAvatar from "../../components/UserAvatar";
export default function EditProfile() {
  const { logout, user, setUser } = useAuth();
  const { setToast } = useToast();
  const { t } = useTranslation();
  const [, setLoading] = useState(true);
  const [savingAccount, setSavingAccount] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // User fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  // Profile fields
  const [address, setAddress] = useState("");
  const [university, setUniversity] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [socialLinks, setSocialLinks] = useState({
    facebook: "",
    instagram: "",
    twitter: "",
    linkedin: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/profile");
        if (res.data.data) {
          const profile = res.data.data;
          console.log(profile)
          setName(profile.name || "");
          setEmail(profile.email || "");
          setAvatar(profile.avatar || "");
          setAddress(profile.address || "");
          setUniversity(profile.university || "");
          setBio(profile.bio || "");
          setSocialLinks({
            facebook: profile.socialLinks?.facebook || "",
            instagram: profile.socialLinks?.instagram || "",
            twitter: profile.socialLinks?.twitter || "",
            linkedin: profile.socialLinks?.linkedin || "",
          });
        }
      } catch (err) {
        console.error(err);
        setError(t('editProfile.errorMessage'));
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [t, setLoading]);

  const handleSocialChange = (field, value) => {
    setSocialLinks((prev) => ({ ...prev, [field]: value }));
  };

  const handleAvatarFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
  };

  const handleUploadAvatar = async () => {
    if (!avatarFile) {
      setToast({ message: t('editProfile.selectAvatar') || 'Select an image first', type: 'info' });
      return;
    }

    setUploadingAvatar(true);
    const formData = new FormData();
    formData.append("avatar", avatarFile);

    try {
      const res = await API.post("/profile/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const uploaded = res?.data?.data?.avatar;
      if (uploaded) {
        setAvatar(uploaded);
        setToast({ message: t('editProfile.avatarUploaded') || 'Avatar updated', type: 'success' });
        setUser((prev) => (prev ? { ...prev, avatar: uploaded } : prev));
      }
    } catch (err) {
      console.error(err);
      setToast({
        message: err.response?.data?.message || t('editProfile.errorMessage') || 'Upload failed',
        type: 'error',
      });
    } finally {
      setUploadingAvatar(false);
    }
  };

  // تحديث بيانات الـ User
  const handleSaveAccount = async () => {
    setError("");
    setSuccessMsg("");
    if (password && password !== passwordConfirm) {
      setError(t('editProfile.passwordMismatch'));
      return;
    }

    setSavingAccount(true);
    try {
      await API.put("/auth/profile", {
        name,
        email,
        password: password || undefined,
        passwordConfirm: passwordConfirm || undefined,
      });
      setToast({
        message: t('editProfile.successMessage'),
        type: "success",
      })
      setPassword("");
      setPasswordConfirm("");
      setUser((prev) => (
        prev
          ? { ...prev, name, email }
          : { id: user?.id || user?._id, name, email, avatar: avatar || prev?.avatar || "" }
      ));
    } catch (err) {
      console.error(err);
      setToast({
        message: err.response?.data?.message || t('editProfile.errorMessage'),
        type: "error",
      });
    } finally {
      setSavingAccount(false);
    }
  };

  // تحديث بيانات الـ UserProfile
  const handleSaveProfile = async () => {
    setError("");
    setSuccessMsg("");
    setSavingProfile(true);
    try {
      await API.post("/profile", {
        avatar,
        address,
        university,
        bio,
        socialLinks,
      });
      setToast({
        message: t('editProfile.successMessage'),
        type: "success",
      });
      setUser((prev) => (
        prev ? { ...prev, avatar: avatar || prev.avatar } : prev
      ));
    } catch (err) {
      console.error(err);
      setToast({
        message: err.response?.data?.message || t('editProfile.errorMessage'),
        type: "error",
      });
    } finally {
      setSavingProfile(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary flex flex-col">
      <Header title={t('editProfile.title')} onLogout={logout} />

      <main className="container mx-auto flex-1 px-4 md:px-6 py-6 md:py-8 space-y-6 md:space-y-8 max-w-3xl">
        {error && <p className="text-red-500 text-sm md:text-base">{error}</p>}
        {successMsg && <p className="text-green-500 text-sm md:text-base">{successMsg}</p>}

        {/* Account Info Card */}
        <div className="bg-secondary p-4 md:p-6 rounded-xl shadow-md space-y-4">
          <h3 className="text-base md:text-lg font-semibold text-dark">{t('editProfile.accountInfo')}</h3>
          <input
            type="text"
            placeholder={t('editProfile.name')}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 md:px-4 py-2 md:py-3 text-sm md:text-base rounded-lg border border-accent focus:ring-1 focus:ring-accent bg-primary text-dark"
          />
          <input
            type="email"
            placeholder={t('editProfile.email')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-accent focus:ring-1 focus:ring-accent bg-primary text-dark"
          />
          <input
            type="password"
            placeholder={t('editProfile.newPassword')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-accent focus:ring-1 focus:ring-accent bg-primary text-dark"
          />
          <input
            type="password"
            placeholder={t('editProfile.confirmPassword')}
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-accent focus:ring-1 focus:ring-accent bg-primary text-dark"
          />
          <button
            onClick={handleSaveAccount}
            disabled={savingAccount}
            className="w-full py-3 rounded-lg bg-accent text-dark font-semibold hover:bg-dark hover:text-secondary transition"
          >
            {savingAccount ? t('common.loading') : t('editProfile.saveAccountInfo')}
          </button>
        </div>

        {/* Profile Info Card */}
        <div className="bg-secondary p-6 rounded-xl shadow-md space-y-4">
          <h3 className="text-lg font-semibold text-dark">{t('editProfile.profileInfo')}</h3>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <UserAvatar
              name={name || "User"}
              avatar={avatar}
              isOnline={true}
              lastSeen={null}
              size="md"
              showStatusText={false}
            />
            <div className="flex-1 space-y-2 w-full">
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarFileChange}
                className="w-full px-4 py-3 rounded-lg border border-accent focus:ring-1 focus:ring-accent bg-primary text-dark"
              />
              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={handleUploadAvatar}
                  disabled={uploadingAvatar}
                  className="px-4 py-2 rounded-lg bg-accent text-dark font-semibold hover:bg-dark hover:text-secondary transition disabled:opacity-60"
                >
                  {uploadingAvatar ? t('common.loading') : (t('editProfile.uploadAvatar') || 'Upload Avatar')}
                </button>
                {avatar && (
                  <button
                    onClick={() => setAvatar("")}
                    className="px-4 py-2 rounded-lg bg-slate-200 text-dark font-semibold hover:bg-slate-300 transition"
                  >
                    {t('editProfile.clearAvatar') || 'Remove avatar'}
                  </button>
                )}
              </div>
              {avatar && (
                <p className="text-xs text-slate-600 break-all">{avatar}</p>
              )}
            </div>
          </div>
          <input
            type="text"
            placeholder={t('editProfile.address')}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-accent focus:ring-1 focus:ring-accent bg-primary text-dark"
          />
          <input
            type="text"
            placeholder={t('editProfile.university')}
            value={university}
            onChange={(e) => setUniversity(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-accent focus:ring-1 focus:ring-accent bg-primary text-dark"
          />
          <textarea
            placeholder={t('editProfile.bio')}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-accent focus:ring-1 focus:ring-accent bg-primary text-dark"
            maxLength={500}
            rows={4}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.keys(socialLinks).map((key) => (
              <input
                key={key}
                type="text"
                placeholder={t(`editProfile.${key}`)}
                value={socialLinks[key]}
                onChange={(e) => handleSocialChange(key, e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-accent focus:ring-1 focus:ring-accent bg-primary text-dark"
              />
            ))}
          </div>
          <button
            onClick={handleSaveProfile}
            disabled={savingProfile}
            className="w-full py-3 rounded-lg bg-accent text-dark font-semibold hover:bg-dark hover:text-secondary transition"
          >
            {savingProfile ? t('common.loading') : t('editProfile.saveProfileInfo')}
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
