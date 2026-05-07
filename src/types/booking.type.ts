// {
//     "success": true,
//     "message": "Booking created successfully",
//     "data": {
//         "id": "5a381827-acb8-40ad-908e-f8af81aaf6ae",
//         "userId": "oj46Ud78jwQOY0e7tRGkPrbzjggiQh2d",
//         "ideaId": "8013f109-03a3-4ad0-aad1-08cbb7abd6ba",
//         "seatConfigId": "e93444b7-4859-4e2a-9eb3-1cb317ba2193",
//         "seatCount": 2,
//         "bookingCode": "BK-AB3A63FC",
//         "status": "CONFIRMED",
//         "createdAt": "2026-05-07T19:03:40.361Z",
//         "updatedAt": "2026-05-07T19:03:40.361Z",
//         "idea": {
//             "title": "Summer Night Music Concert"
//         },
//         "seatConfig": {
//             "venue": "Bangladesh Army Stadium, Dhaka",
//             "startTime": "2026-07-15T17:00:00.000Z",
//             "endTime": "2026-07-15T23:00:00.000Z"
//         }
//     }
// }

export interface IBookingResponse {
  id: string;
  userId: string;
  ideaId: string;
  seatConfigId: string;
  seatCount: number;
  bookingCode: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  idea: {
    title: string;
  };
  seatConfig: {
    venue: string;
    startTime: string;
    endTime: string;
  };
}
