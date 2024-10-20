/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import MeetingTypeList from '@/components/MeetingTypeList';
import React, { useEffect, useState } from 'react';
import { useGetCalls } from '@/hooks/useGetCalls';
import { Call } from '@stream-io/video-react-sdk'; // Assuming this is the correct import

const Home = () => {
// State for time and date
  const [time, setTime] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const now = new Date();

  // Fetch upcoming calls
  const { upcomingCalls } = useGetCalls();
  const [nextMeeting, setNextMeeting] = useState<Call | null>(null);

    // Update time and date every second
    useEffect(() => {
      const interval = setInterval(() => {
        const now = new Date();
        const currentTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        const currentDate = new Intl.DateTimeFormat('en-US', { dateStyle: 'full' }).format(now);
        setTime(currentTime);
        setDate(currentDate);
      }, 1000);
  
      return () => clearInterval(interval); // Clear interval on component unmount
    }, []);

  // Get the next upcoming meeting
  useEffect(() => {
    if (upcomingCalls && upcomingCalls.length > 0) {
      // Filter the meetings to find the one that is scheduled to happen next
      const now = new Date();

      const upcoming = upcomingCalls
        .filter((call: Call) => {
          // Ensure startsAt exists and is a valid date string/number
          return call.state.startsAt && new Date(call.state.startsAt) > now;
        })
        .sort((a: Call, b: Call) => {
          // Sort the meetings by start time
          const dateA = a.state.startsAt ? new Date(a.state.startsAt).getTime() : Infinity;
          const dateB = b.state.startsAt ? new Date(b.state.startsAt).getTime() : Infinity;
          return dateA - dateB;
        });

      // Set the next upcoming meeting
      setNextMeeting(upcoming[0] || null);
    }
  }, [upcomingCalls]); // Dependency on `upcomingCalls`

  // Format the next meeting date to "DD/MonthName HH:mm"
  const formatNextMeetingDate = (dateObject: Date) => {
    const optionsDate: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'long' }; // "DD/MonthName"
    const formattedDate = new Intl.DateTimeFormat('en-US', optionsDate).format(dateObject);
    const formattedTime = dateObject.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }); // "HH:mm"
  
    return ` ${formattedDate} - ${formattedTime}`; // Combine date and time
  };

  return (
    <section className="flex size-full flex-col gap-10 text-white">
      <div
        style={{ backgroundImage: "url('/images/hero-background.png')" }}
        className="h-[300px] w-full rounded-[20px] bg-hero bg-cover"
      >
        <div className="flex h-full flex-col justify-between max-md:px-5 max-md:py-8 lg:p-11">
          {/* Displaying the next meeting time inside the button */}
          <h2 className="glassmorphism max-w-[300px] lg:max-w-[400px] rounded py-1.5 lg:py-2 text-center text-sm lg:text-base font-normal">
            {nextMeeting && nextMeeting.state.startsAt
              ? `Upcoming Meeting at: ${formatNextMeetingDate(new Date(nextMeeting.state.startsAt))}`
              : 'Upcoming Meetings: No meetings scheduled'}
          </h2>

          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-extrabold lg:text-7xl">
              {time}
            </h1>
            <p className="text-lg font-medium text-sky-1 lg:text-2xl">
              {date}
            </p>
          </div>
        </div>
      </div>

      <MeetingTypeList />
    </section>
  );
};

export default Home;
