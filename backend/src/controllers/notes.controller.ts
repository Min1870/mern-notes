import { NextFunction, Request, RequestHandler, Response } from "express";
import createHttpError from "http-errors";
import Notes from "../models/notes.model";
import mongoose from "mongoose";

interface UserPayload {
  _id: string;
}

interface AuthenticatedRequest extends Request {
  user?: UserPayload;
}

export const getNotes: RequestHandler = async (
  req: AuthenticatedRequest,
  res,
  next
) => {
  const user = req.user;
  try {
    if (!user) {
      throw createHttpError(401, "User not authenticated.");
    }
    const notes = await Notes.find({ userId: user._id });
    res.status(200).json(notes);
  } catch (error) {
    next(error);
  }
};

export const getNote: RequestHandler = async (
  req: AuthenticatedRequest,
  res,
  next
) => {
  const noteId = req.params.noteId;
  const user = req.user;

  try {
    if (!mongoose.isValidObjectId(noteId)) {
      throw createHttpError(400, "Invalid note id");
    }

    if (!user) {
      throw createHttpError(401, "User not authenticated.");
    }

    const note = await Notes.findById(noteId).exec();

    if (!note) {
      throw createHttpError(404, "Note not found");
    }

    res.status(200).json(note);
  } catch (error) {
    next(error);
  }
};

interface CreateNoteBody {
  title: string;
  content: string;
  tags: string[];
}

export const createNote: RequestHandler = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const { title, content, tags } = req.body as CreateNoteBody;
  const user = req.user;

  try {
    if (!title) {
      throw createHttpError(400, "Title is required.");
    }
    if (!content) {
      throw createHttpError(400, "Content is required.");
    }
    if (!user) {
      throw createHttpError(401, "User not authenticated.");
    }

    const note = await Notes.create({
      title,
      content,
      tags: tags || [],
      userId: user._id,
    });

    res.status(201).json({
      error: false,
      note,
      message: "Note add successfully",
    });
  } catch (error) {
    next(error);
  }
};

interface UpdateNoteBody {
  title?: string;
  content?: string;
  tags?: string[];
  isPinned?: boolean;
}

export const editNote: RequestHandler = async (
  req: AuthenticatedRequest,
  res,
  next
) => {
  const noteId = req.params.noteId;
  const user = req.user;

  const {
    title: newTitle,
    content: newContent,
    tags: newTags,
    isPinned,
  } = req.body as UpdateNoteBody;

  try {
    if (!mongoose.isValidObjectId(noteId)) {
      throw createHttpError(400, "Invalid note id");
    }

    // if (!newTitle) {
    //   throw createHttpError(400, "Note must have a title");
    // }
    // if (!newContent) {
    //   throw createHttpError(400, "Note must have a Content");
    // }

    if (!user) {
      throw createHttpError(401, "User not authenticated.");
    }

    const updatedNote = await Notes.findByIdAndUpdate(
      noteId,
      {
        title: newTitle,
        content: newContent,
        tags: newTags,
        isPinned,
        userId: user._id,
      },
      { new: true, runValidators: true }
    );

    if (!updatedNote) {
      throw createHttpError(404, "Note not found");
    }

    res.status(200).json(updatedNote);
  } catch (error) {
    next(error);
  }
};

export const deleteNote: RequestHandler = async (
  req: AuthenticatedRequest,
  res,
  next
) => {
  const noteId = req.params.noteId;
  const user = req.user;

  try {
    if (!mongoose.isValidObjectId(noteId)) {
      throw createHttpError(400, "Invalid note id");
    }

    if (!user) {
      throw createHttpError(401, "User not authenticated.");
    }

    const note = await Notes.findByIdAndDelete(noteId).exec();

    if (!note) {
      throw createHttpError(404, "Note not found");
    }

    res.status(204).json();
  } catch (error) {
    next(error);
  }
};

// export const pinNote: RequestHandler = async (
//   req: AuthenticatedRequest,
//   res,
//   next
// ) => {
//   const noteId = req.params.noteId;
//   const user = req.user;

//   const { isPinned } = req.body as UpdateNoteBody;

//   try {
//     if (!mongoose.isValidObjectId(noteId)) {
//       throw createHttpError(400, "Invalid note id");
//     }

//     if (!user) {
//       throw createHttpError(401, "User not authenticated.");
//     }

//     const updatedNote = await Notes.findByIdAndUpdate(
//       noteId,
//       { isPinned, userId: user._id },
//       { new: true, runValidators: true }
//     );

//     if (!updatedNote) {
//       throw createHttpError(404, "Note not found");
//     }

//     res.status(200).json(updatedNote);
//   } catch (error) {
//     next(error);
//   }
// };
