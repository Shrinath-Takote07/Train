// Mock train data generator
export const generateMockTrains = () => {
  const trains = [];
  const stations = [
    "New Delhi",
    "Mumbai Central",
    "Howrah",
    "Chennai Central",
    "Bangalore City",
    "Hyderabad Deccan",
    "Ahmedabad",
    "Pune Junction",
    "Lucknow",
    "Jaipur",
    "Kolkata",
    "Secunderabad",
  ];

  const trainNames = [
    "Rajdhani Express",
    "Shatabdi Express",
    "Duronto Express",
    "Garib Rath",
    "Sampark Kranti",
    "Jan Shatabdi",
    "Vande Bharat",
    "Tejas Express",
    "Humsafar Express",
  ];

  const statuses = ["Running", "Stopped", "Delayed", "On Time", "Cancelled"];
  const platformNumbers = [1, 2, 3, 4, 5, 6, 7, 8];

  for (let i = 1; i <= 20; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const delay =
      status === "Delayed"
        ? Math.floor(Math.random() * 120) + 10
        : status === "Running"
          ? Math.floor(Math.random() * 15)
          : 0;

    const source = stations[Math.floor(Math.random() * stations.length)];
    let destination = stations[Math.floor(Math.random() * stations.length)];
    while (destination === source) {
      destination = stations[Math.floor(Math.random() * stations.length)];
    }

    // Generate 2-4 random intermediate stops
    const numStops = Math.floor(Math.random() * 3) + 2;
    const stops = [];
    for (let j = 0; j < numStops; j++) {
      let stopStation = stations[Math.floor(Math.random() * stations.length)];
      if (stopStation !== source && stopStation !== destination && !stops.find(s => s.stationName === stopStation)) {
        stops.push({
          stationName: stopStation,
          arrivalTime: new Date(Date.now() + (j + 1) * 3600000).toISOString(),
          departureTime: new Date(Date.now() + (j + 1) * 3600000 + 300000).toISOString(),
        });
      }
    }

    trains.push({
      trainId: `T${String(i).padStart(4, "0")}`,
      trainName:
        trainNames[Math.floor(Math.random() * trainNames.length)] + ` ${i}`,
      number: `${Math.floor(Math.random() * 9000) + 1000}`,
      source: source,
      destination: destination,
      currentStation: stations[Math.floor(Math.random() * stations.length)],
      platform:
        platformNumbers[Math.floor(Math.random() * platformNumbers.length)],
      status: status,
      delay: delay,
      progress: Math.floor(Math.random() * 100),
      speed: Math.floor(Math.random() * 120) + 20,
      lastUpdated: new Date().toISOString(),
      nextStation: stops.length > 0 ? stops[0].stationName : destination,
      stops: stops,
      arrivalTime: new Date(Date.now() + 10 * 3600000).toISOString(),
      departureTime: new Date(Date.now() - 2 * 3600000).toISOString(),
    });
  }
  return trains;
};

// Mock PNR data generator
export const generateMockPNR = (pnrNumber) => {
  const statuses = ["Confirmed", "Waiting List", "RAC", "Cancelled"];
  const passengers = [
    "Mr. Raj Kumar",
    "Ms. Priya Sharma",
    "Mr. Amit Singh",
    "Mrs. Deepa Patel",
    "Mr. Sanjay Verma",
  ];
  const classes = ["1A", "2A", "3A", "SL", "CC", "EC"];

  return {
    pnrNumber: pnrNumber || `PNR${Math.floor(Math.random() * 999999)}`,
    trainNumber: `${Math.floor(Math.random() * 9000) + 1000}`,
    trainName: "Express Train",
    journeyDate: new Date(
      Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000,
    ).toISOString(),
    from: "New Delhi",
    to: "Mumbai Central",
    passengers: Array.from(
      { length: Math.floor(Math.random() * 4) + 1 },
      (_, i) => ({
        name: passengers[Math.floor(Math.random() * passengers.length)],
        seatNumber: `${Math.floor(Math.random() * 50) + 1}`,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        coach: `${String.fromCharCode(65 + Math.floor(Math.random() * 10))}${Math.floor(Math.random() * 20) + 1}`,
      }),
    ),
    classType: classes[Math.floor(Math.random() * classes.length)],
    bookingStatus: statuses[Math.floor(Math.random() * statuses.length)],
    chartPrepared: Math.random() > 0.5,
    lastUpdated: new Date().toISOString(),
  };
};

// Generate real-time updates
export const generateLiveUpdate = (train) => {
  const statuses = ["Running", "Stopped", "Delayed", "On Time"];
  const newStatus = statuses[Math.floor(Math.random() * statuses.length)];

  return {
    trainId: train.trainId,
    trainName: train.trainName,
    newStatus: newStatus,
    delay: newStatus === "Delayed" ? Math.floor(Math.random() * 120) + 5 : 0,
    currentStation: train.currentStation,
    nextStation: train.nextStation,
    progress: Math.min(100, train.progress + Math.floor(Math.random() * 5)),
    speed: Math.floor(Math.random() * 120) + 20,
    platform: train.platform,
    timestamp: new Date().toISOString(),
    message: `${train.trainName} is ${newStatus.toLowerCase()} at ${train.currentStation}`,
  };
};
