import moment from "moment";
import Modal from "react-modal";

import { MdCreate, MdDelete, MdOutlinePushPin } from "react-icons/md";
import { useState } from "react";

interface NoteCardProps {
  title: string;
  date: string;
  content: string;
  tags: string[];
  isPinned: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onPinNote: () => void;
}

const NoteCard = ({
  title,
  date,
  content,
  tags,
  isPinned,
  onEdit,
  onDelete,
  onPinNote,
}: NoteCardProps) => {
  const [openDeleteModal, setOpenDeleteModal] = useState({
    isShown: false,
  });
  const handleDelete = () => {
    setOpenDeleteModal({ isShown: true });
  };
  return (
    <div className="border rounded p-4 bg-white hover:shadow-xl transition-all ease-in-out">
      <div className="flex  items-center justify-between">
        <div>
          <h6 className="text-sm font-medium">{title}</h6>
          <span className="text-xs text-slate-500">
            {moment(date).format("Do MMM YYYY")}
          </span>
        </div>
        <MdOutlinePushPin
          className={`icon-btn ${isPinned ? "text-primary" : "text-slate-300"}`}
          onClick={onPinNote}
        />
      </div>
      <p className="text-xs text-slate-600 mt-2">{content.slice(0, 60)}</p>
      <div className="flex items-center justify-between mt-2">
        <div className="text-xs text-slate-500">
          {tags.map((tag) => `#${tag} `)}
        </div>

        <div className="flex items-center gap-2">
          <MdCreate
            className="icon-btn hover:text-green-600"
            onClick={onEdit}
          />
          <MdDelete
            className="icon-btn hover:text-red-500"
            // onClick={onDelete}
            onClick={handleDelete}
          />
          <Modal
            isOpen={openDeleteModal.isShown}
            style={{
              overlay: {
                backgroundColor: "rgba(0,0,0,0.2)",
              },
            }}
            className="w-[30%] max-h-3/4 bg-slate-100 rounded-md mx-auto mt-14 p-5"
          >
            <div>
              <h4 className="text-center mb-4">
                Are you sure you want to delete the note?
              </h4>
              <div className="flex items-center justify-evenly">
                <button
                  onClick={() => {
                    setOpenDeleteModal({ isShown: false });
                  }}
                  className="btn-primary font-medium mt-5 p-3 w-fit"
                >
                  Cancel
                </button>
                <button
                  onClick={onDelete}
                  className="btn-primary font-medium mt-5 p-3 w-fit"
                >
                  Delete
                </button>
              </div>
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
