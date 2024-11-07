import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MdAdd } from "react-icons/md";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import NoteCard from "../../components/Cards/NoteCard";
import axiosInstance from "../../utils/axiosInstance";
import AddEditNotes from "./AddEditNotes";

export interface NotesType {
  _id: string;
  title: string;
  date: string;
  content: string;
  tags: string[];
  isPinned: boolean;
  createdOn: string;
}

const Home = () => {
  const [openAddEditModal, setOpenAddEditModal] = useState<{
    isShown: boolean;
    type: "add" | "edit";
    data: NotesType | null;
  }>({
    isShown: false,
    type: "add",
    data: null,
  });

  const [notes, setNotes] = useState<NotesType[] | undefined>(undefined);

  const navigate = useNavigate();

  const handleEdit = (noteDetails: NotesType) => {
    setOpenAddEditModal({ isShown: true, data: noteDetails, type: "edit" });
  };

  const getUserInfo = async () => {
    try {
      await axiosInstance.get("/api/user");
    } catch (error: any) {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  const getNotes = async () => {
    try {
      const response = await axiosInstance.get("/api/notes");
      setNotes(response.data);
    } catch (error: any) {
      toast.error(error.response.data.error);
    }
  };

  const deleteNote = async (data: NotesType) => {
    const noteId = data?._id;

    try {
      const response = await axiosInstance.delete("/api/notes/" + noteId);

      if (response.data && !response.data.error) {
        toast.success("Note deleted successfully!");
        getNotes();
      }
    } catch (error: any) {
      console.log(error.response.data.error);
      toast.error(error.response.data.error);
    }
  };

  useEffect(() => {
    getNotes();
    getUserInfo();
  }, []);

  return (
    <>
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          {notes?.map((note) => (
            <NoteCard
              key={note._id}
              title={note.title}
              date={note.createdOn}
              content={note.content}
              tags={note.tags}
              isPinned={note.isPinned}
              onEdit={() => handleEdit(note)}
              onDelete={() => deleteNote(note)}
              onPinNote={() => {}}
            />
          ))}
        </div>
      </div>

      <button
        className="w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 absolute right-10 bottom-10"
        onClick={() => {
          setOpenAddEditModal({ isShown: true, type: "add", data: null });
        }}
      >
        <MdAdd className="text-[32px] text-white" />
      </button>

      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
          },
        }}
        contentLabel=""
        className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-scroll"
      >
        <AddEditNotes
          type={openAddEditModal.type}
          noteData={openAddEditModal.data}
          onClose={() => {
            setOpenAddEditModal({ isShown: false, type: "add", data: null });
          }}
          getNotes={getNotes}
        />
      </Modal>
    </>
  );
};

export default Home;
