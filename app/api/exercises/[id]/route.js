import {
  deleteExerciseByUserId,
  updateExerciseByUserId,
} from "@/lib/repository/exercises";
import { getCurrentUser } from "@/lib/auth";

export async function DELETE(req, { params }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { id } = await params;
    if (isNaN(id)) {
      return new Response("Invalid ID", { status: 400 });
    }

    const result = await deleteExerciseByUserId(id, user.id);

    if (result?.error) {
      return Response.json({ error: result.message }, { status: 400 });
    }

    if (!result) {
      return new Response("Exercise not found or not yours", { status: 404 });
    }

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Server error", { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return new Response("Invalid ID", { status: 400 });
    }

    const data = await req.json();

    const updated = await updateExerciseByUserId(id, user.id, data);
    if (!updated) {
      return new Response("Exercise not found or not yours", { status: 404 });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response("Server error", { status: 500 });
  }
}
