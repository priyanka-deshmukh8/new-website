"use client";

import React, { use, useEffect, useState } from "react";
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import { ref, get, update } from "firebase/database";
import { rtdb } from "@/firebase/firebaseConfig";
import { useParams, useRouter } from "next/navigation";
import PreLoader from "../../../../components/Common/PreLoader";
import Image from 'next/image';

interface EventData {
  title: string;
  date: string;
  time: string;
  location: string;
  tracks: string;
  details: string;
  coverImage: string;
  tags: string[];
  imageFile: File | null;
  eventDuration: string;
}

export default withPageAuthRequired(function Profile() {
  const { user, error } = useUser();
  const { id } = useParams();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [eventData, setEventData] = useState<EventData>({
    title: "",
    date: "",
    time: "",
    location: "",
    tracks: "",
    details: "",
    coverImage: "",
    tags: [],
    imageFile: null,
    eventDuration: "",
  });

  useEffect(() => {
    const fetchEventData = async () => {
      const eventRef = ref(rtdb, `events/${id}`);
      const snapshot = await get(eventRef);

      if (snapshot.exists()) {
        const data = snapshot.val();
        setEventData({
          ...data,
          tags: data.tags || [],
          imageFile: null,
        });
      }
    };

    fetchEventData();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEventData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setEventData((prev) => ({
      ...prev,
      tags: value.split(",").map((tag) => tag.trim()),
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEventData((prev) => ({ ...prev, imageFile: file }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let imageUrl = eventData.coverImage;

      // Only upload new image if one was selected
      if (eventData.imageFile) {
        const formData = new FormData();
        formData.append("image", eventData.imageFile);
        formData.append("key", "f43b433f78cbc31cb8db83f31f76ee8c");

        const response = await fetch("https://api.imgbb.com/1/upload", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        if (data.success) {
          imageUrl = data.data.url;
        }
      }

      // Update event data in Firebase
      const eventRef = ref(rtdb, `events/${id}`);
      await update(eventRef, {
        ...eventData,
        coverImage: imageUrl,
      });

      alert("Event updated successfully!");
      router.push('/events');
    } catch (error) {
      console.error("Error updating event: ", error);
      alert("Error updating event");
    } finally {
      setIsSubmitting(false);
    }
  };

  console.log(user);
  if(error) console.log(error);
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col justify-center items-center p-4">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg w-full max-w-lg p-6" style={{ margin: "120px 1rem 1rem 1rem" }}>
        <h2 className="text-2xl font-medium text-center mb-6 text-gray-900 dark:text-white">Edit Event</h2>
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col">
          <input
            type="text"
            name="title"
            placeholder="Event Title"
            value={eventData.title}
            onChange={handleChange}
            required
            className="border mt-2 mb-2 border-gray-300 dark:border-gray-600 rounded-md p-2 w-full focus:outline-blue-500 dark:bg-gray-700 dark:text-white"
          />

          <label className="pb-0 pt-2 p-2 text-gray-900 dark:text-white">Event Date</label>
          <input
            type="date"
            name="date"
            value={eventData.date}
            onChange={handleChange}
            required
            className="border mt-0.5 mb-2 border-gray-300 dark:border-gray-600 rounded-md p-2 w-full focus:outline-blue-500 dark:bg-gray-700 dark:text-white"
          />

          <label className="pb-0 pt-2 p-2 text-gray-900 dark:text-white">Event Schedule</label>
          <input
            type="time"
            name="time"
            value={eventData.time}
            onChange={handleChange}
            required
            className="border mt-1 mb-2 border-gray-300 dark:border-gray-600 rounded-md p-2 w-full focus:outline-blue-500 dark:bg-gray-700 dark:text-white"
          />

          <input
            type="text"
            name="eventDuration"
            value={eventData.eventDuration}
            onChange={handleChange}
            required
            placeholder="Event Duration in hours"
            className="border mt-2 mb-2 border-gray-300 dark:border-gray-600 rounded-md p-2 w-full focus:outline-blue-500 dark:bg-gray-700 dark:text-white"
          />

          <input
            type="text"
            name="location"
            placeholder="Event Location"
            value={eventData.location}
            onChange={handleChange}
            required
            className="border mt-2 mb-2 border-gray-300 dark:border-gray-600 rounded-md p-2 w-full focus:outline-blue-500 dark:bg-gray-700 dark:text-white"
          />

          <textarea
            name="details"
            placeholder="Event Details"
            value={eventData.details}
            onChange={handleChange}
            required
            className="border mt-2 mb-2 border-gray-300 dark:border-gray-600 rounded-md p-2 w-full focus:outline-blue-500 resize-none dark:bg-gray-700 dark:text-white h-32"
          />

          <input
            type="text"
            name="tracks"
            placeholder="Event Tracks"
            value={eventData.tracks}
            onChange={handleChange}
            className="border mt-2 mb-2 border-gray-300 dark:border-gray-600 rounded-md p-2 w-full focus:outline-blue-500 dark:bg-gray-700 dark:text-white"
          />

          <div className="mt-2 mb-2">
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">
              Current Image
            </label>
            {eventData.coverImage && (
              <Image
                src={eventData.coverImage}
                alt="Current event cover"
                width={500}
                height={300}
                className="w-full h-32 object-cover rounded-md mb-2"
              />
            )}
            <input
              type="file"
              name="coverImage"
              onChange={handleImageChange}
              accept="image/*"
              className="border border-gray-300 dark:border-gray-600 rounded-md p-2 w-full focus:outline-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <input
            type="text"
            name="tags"
            placeholder="Event Tags (comma separated)"
            value={eventData.tags.join(", ")}
            onChange={handleTagsChange}
            className="border mt-2 mb-2 border-gray-300 dark:border-gray-600 rounded-md p-2 w-full focus:outline-blue-500 dark:bg-gray-700 dark:text-white"
          />

          <div className="flex justify-between items-center mt-4">
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600 transition-all"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Update Event"}
            </button>
            <button
              type="button"
              className="border border-gray-300 dark:border-gray-600 py-2 px-6 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
              onClick={() => router.push('/events')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});
