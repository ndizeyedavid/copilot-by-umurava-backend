"use client";

import { useState, useMemo } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Grid3X3,
  List,
  CalendarDays,
  Briefcase,
  CalendarCheck,
  UserCheck,
} from "lucide-react";

import "./calendar.css";

interface JobEvent {
  id: string;
  title: string;
  companyName: string;
  description: string;
  date: Date;
  startTime?: string;
  endTime?: string;
  location?: string;
  category: "deadline" | "posted" | "interview";
  color: string;
}

const categoryColors = {
  deadline: "bg-red-100 text-red-800 border-red-200",
  posted: "bg-blue-100 text-blue-800 border-blue-200",
  interview: "bg-green-100 text-green-800 border-green-200",
};

const mockJobEvents: JobEvent[] = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    companyName: "TechCorp Solutions",
    description: "Application deadline for Senior Frontend Developer position",
    date: new Date(2026, 3, 16, 23, 59), // April 16, 2026
    category: "deadline",
    color: "#EF4444",
  },
  {
    id: "2",
    title: "Full Stack Engineer",
    companyName: "Digital Innovations",
    description: "New job posting for Full Stack Engineer role",
    date: new Date(2026, 3, 14, 9, 0), // April 14, 2026 (Today)
    category: "posted",
    color: "#3B82F6",
  },
  {
    id: "3",
    title: "UI/UX Designer Interview",
    companyName: "Creative Studios",
    description: "Technical interview for UI/UX Designer position",
    date: new Date(2026, 3, 17, 14, 0), // April 17, 2026
    startTime: "14:00",
    endTime: "15:30",
    location: "Zoom Meeting",
    category: "interview",
    color: "#10B981",
  },
  {
    id: "4",
    title: "Backend Developer",
    companyName: "StartupHub",
    description: "Application deadline for Backend Developer position",
    date: new Date(2026, 3, 18, 23, 59), // April 18, 2026
    category: "deadline",
    color: "#EF4444",
  },
  {
    id: "5",
    title: "DevOps Engineer",
    companyName: "CloudTech Inc",
    description: "New job posting for DevOps Engineer role",
    date: new Date(2026, 3, 15, 10, 0), // April 15, 2026
    category: "posted",
    color: "#3B82F6",
  },
  {
    id: "6",
    title: "Product Manager Interview",
    companyName: "Enterprise Solutions",
    description: "Final round interview for Product Manager position",
    date: new Date(2026, 3, 19, 16, 0), // April 19, 2026
    startTime: "16:00",
    endTime: "17:00",
    location: "Microsoft Teams",
    category: "interview",
    color: "#10B981",
  },
];

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [view, setView] = useState<"month" | "week" | "day">("week");
  const [jobEvents, setJobEvents] = useState<JobEvent[]>(mockJobEvents);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredEvents = useMemo(() => {
    return jobEvents.filter((event) => {
      const matchesSearch =
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || event.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [jobEvents, searchQuery, selectedCategory]);

  const eventsForSelectedDate = useMemo(() => {
    return filteredEvents.filter((event) => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === selectedDate.toDateString();
    });
  }, [filteredEvents, selectedDate]);

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view !== "month") return null;

    const dayEvents = jobEvents.filter((event) => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === date.toDateString();
    });

    if (dayEvents.length === 0) return null;

    return (
      <div className="flex gap-1 justify-center mt-1">
        {dayEvents.slice(0, 3).map((event, idx) => (
          <div
            key={idx}
            className="w-3 h-1 rounded-full"
            style={{ backgroundColor: event.color }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Job Calendar
              </h1>
              <p className="text-gray-600">
                Track job deadlines, postings, and interviews
              </p>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                <option value="deadline">Deadlines</option>
                <option value="posted">New Postings</option>
                <option value="interview">Interviews</option>
              </select>
            </div>
          </div>
        </div>

        {/* View Toggle and Calendar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  {selectedDate.toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setView("month")}
                    className={`p-2 rounded-lg transition-colors ${
                      view === "month"
                        ? "bg-blue-100 text-blue-600"
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    <CalendarDays className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setView("week")}
                    className={`p-2 rounded-lg transition-colors ${
                      view === "week"
                        ? "bg-blue-100 text-blue-600"
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setView("day")}
                    className={`p-2 rounded-lg transition-colors ${
                      view === "day"
                        ? "bg-blue-100 text-blue-600"
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="react-calendar-wrapper">
                <Calendar
                  // @ts-ignore
                  onChange={setSelectedDate}
                  value={selectedDate}
                  tileContent={tileContent}
                  className="custom-react-calendar"
                  prevLabel={<ChevronLeft className="h-4 w-4" />}
                  nextLabel={<ChevronRight className="h-4 w-4" />}
                  prev2Label={null}
                  next2Label={null}
                  formatShortWeekday={(locale, date) =>
                    date
                      .toLocaleDateString("en-US", { weekday: "short" })
                      .charAt(0)
                  }
                />
              </div>
            </div>
          </div>

          {/* Events Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {selectedDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "short",
                  day: "numeric",
                })}
              </h3>

              {eventsForSelectedDate.length === 0 ? (
                <div className="text-center py-8">
                  <CalendarIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No job events scheduled</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {eventsForSelectedDate.map((event) => (
                    <div
                      key={event.id}
                      className="border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {event.title}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {event.companyName}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          {event.category === "deadline" && (
                            <Briefcase className="h-4 w-4 text-red-500" />
                          )}
                          {event.category === "posted" && (
                            <CalendarCheck className="h-4 w-4 text-blue-500" />
                          )}
                          {event.category === "interview" && (
                            <UserCheck className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {event.description}
                      </p>
                      {event.startTime && (
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {event.startTime}{" "}
                            {event.endTime && `- ${event.endTime}`}
                          </div>
                          {event.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {event.location}
                            </div>
                          )}
                        </div>
                      )}
                      <div className="mt-2">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${categoryColors[event.category]}`}
                        >
                          {event.category === "deadline" &&
                            "Application Deadline"}
                          {event.category === "posted" && "New Posting"}
                          {event.category === "interview" && "Interview"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <style jsx global>{``}</style>
    </div>
  );
}
