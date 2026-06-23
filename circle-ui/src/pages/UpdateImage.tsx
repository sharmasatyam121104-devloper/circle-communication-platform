import { Upload } from "lucide-react";
import Button from "../Components/ui/Button";
import { useNavigate } from "react-router-dom";
import clientCatchError from "../lib/clientCatchError";
import api from "../lib/api";
import { toast } from "sonner";
import { useState } from "react";
import useAuthStore from "../store/useAuthStore";


const UpdateImage = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const getMe = useAuthStore((state) => state.getMe);
  const user = useAuthStore((state) => state.user);

  const goOnChat = () => {
    navigate("/chat");
  };

  const handleImageSelect = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setSelectedFile(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const uploadImage = async () => {
    try {
      if (!selectedFile) {
        return toast.error("Please select an image first");
      }

      const formData = new FormData();
      formData.append("profilePicture", selectedFile);

      setLoading(true);

      const { data } = await api.put(
        "/user/profile-picture",
        formData
      );

      toast.success(data.message);

      await getMe();

      navigate("/chat");
    } catch (error) {
      clientCatchError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 md:p-8">
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
            Update Profile Photo
          </h1>

          <p className="text-slate-500 mt-2 text-sm">
            Upload a new profile picture to personalize your account.
          </p>
        </div>

        {/* Profile Preview */}
        <div className="flex justify-center mt-8">
          <div className="h-32 w-32 md:h-36 md:w-36 rounded-full overflow-hidden border-4 border-indigo-100 shadow-lg">
            <img
              src={
                previewImage ||
                `${user?.data?.profile_picture_url}`
              }
              alt="Profile"
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        {/* Upload Area */}
        <label
          htmlFor="profile-image"
          className="mt-8 flex flex-col items-center justify-center border-2 border-dashed border-indigo-300 rounded-2xl p-8 cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-all"
        >
          <Upload size={40} />

          <p className="mt-3 font-medium text-slate-700">
            Click to choose image
          </p>

          <p className="text-sm text-slate-500 mt-1">
            PNG, JPG, JPEG up to 5MB
          </p>

          <input
            id="profile-image"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageSelect}
          />
        </label>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-8">
          <Button
            loading={loading}
            disabled={loading || !selectedFile}
            className="w-full"
            onClick={uploadImage}
          >
            Save Changes
          </Button>

          <Button
            loading={loading}
            disabled={loading}
            bgColor="bg-rose-600"
            className="w-full"
            onClick={goOnChat}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UpdateImage;