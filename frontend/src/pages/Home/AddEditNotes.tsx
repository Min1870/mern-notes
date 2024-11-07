import { useState } from "react";
import { MdClose } from "react-icons/md";
import TagInput from "../../components/Input/TagInput";
import axiosInstance from "../../utils/axiosInstance";
import { NotesType } from "./Home";
import toast from "react-hot-toast";

interface AddEditNotesProps {
  noteData: NotesType | null;
  type: string;
  onClose: () => void;
  getNotes: () => void;
}

const AddEditNotes = ({
  noteData,
  type,
  onClose,
  getNotes,
}: AddEditNotesProps) => {
  const [title, setTitle] = useState(noteData?.title || "");
  const [content, setContent] = useState(noteData?.content || "");
  const [tags, setTags] = useState<string[]>(noteData?.tags || []);
  const [error, setError] = useState("");

  const addNewNote = async () => {
    try {
      const response = await axiosInstance.post("/api/notes", {
        title,
        content,
        tags,
      });
      console.log(response.data);
      if (response.data) {
        getNotes();
        onClose();
        toast.success("Note added successfully!");
      }
    } catch (error: any) {
      setError(error.response.data.error);
    }
  };
  const editNote = async () => {
    const noteId = noteData?._id;
    try {
      const response = await axiosInstance.patch("/api/notes/" + noteId, {
        title,
        content,
        tags,
      });

      if (response.data) {
        getNotes();
        onClose();
        toast.success("Note edited successfully!");
      }
    } catch (error: any) {
      setError(error.response.data.error);
    }
  };

  const handleAddNote = () => {
    if (!title) {
      setError("Please enter the title.");
      return;
    }
    if (!content) {
      setError("Please enter the content");
      return;
    }
    setError("");

    if (type === "edit") {
      editNote();
    } else {
      addNewNote();
    }
  };
  return (
    <div className="relative">
      <button
        className="w-10 h-10 rounded-full items-center justify-center absolute flex -top-3 -right-3 hover:bg-slate-50"
        onClick={onClose}
      >
        <MdClose />
      </button>
      <div className="flex flex-col gap-2">
        <label htmlFor="" className="input-label">
          TITLE
        </label>
        <input
          type="text"
          className="text-2xl text-slate-950 outline-none"
          placeholder="Go to gym at 5"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>

      <div className="flex flex-col gap-2 mt-4">
        <label htmlFor="" className="input-label">
          CONTENT
        </label>
        <textarea
          name=""
          id=""
          className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded"
          placeholder="Content"
          rows={10}
          value={content}
          onChange={({ target }) => setContent(target.value)}
        ></textarea>
      </div>
      <div className="mt-3">
        <label htmlFor="" className="input-label">
          TAGS
        </label>
        <TagInput tags={tags} setTags={setTags} />
      </div>

      {error && <p className="text-red-500 text-xs pt-4">{error}</p>}

      <button
        className="btn-primary font-medium mt-5 p-3"
        onClick={handleAddNote}
      >
        {type === "edit" ? "UPDATE" : "ADD"}
      </button>
    </div>
  );
};

export default AddEditNotes;
