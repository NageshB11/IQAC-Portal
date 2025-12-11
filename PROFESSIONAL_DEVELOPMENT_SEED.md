# Professional Development Activities - Seed Data

## Overview
Successfully added 13 professional development activities (workshops and seminars) from the 2023-24 academic year to the database.

## Seeded Data Summary

### Total Statistics
- **Total Activities**: 13
- **Workshops**: 8
- **Seminars**: 5
- **Total Participants**: 1,187

### Activities Added

#### Computer Science & Engineering Activities

1. **Concrete Mix Design Workshop**
   - Type: Workshop
   - Date: May 22, 2024
   - Duration: 1 day
   - Participants: 107
   - Mode: Offline

2. **Two Days Hands-on Workshop on Front-end Development**
   - Type: Workshop
   - Date: Feb 26-27, 2024
   - Duration: 2 days
   - Participants: 70
   - Mode: Offline

3. **Two-Days Hands-on Workshop on Machine Learning using Python**
   - Type: Workshop
   - Date: March 1-2, 2024
   - Duration: 2 days
   - Participants: 64
   - Mode: Offline

4. **One-Day Hands-on Workshop on Git and GitHub**
   - Type: Workshop
   - Date: April 3, 2024
   - Duration: 1 day
   - Participants: 70
   - Mode: Offline

5. **A Live Online Session on "Getting Jobs and Internship in the Domain of AI Development"**
   - Type: Seminar
   - Date: May 15, 2024
   - Duration: 1 day
   - Participants: 232
   - Mode: Online

6. **Two-days Hands-on Workshop on Data nAnalytics with Python**
   - Type: Workshop
   - Date: May 16-17, 2024
   - Duration: 2 days
   - Participants: 68
   - Mode: Offline

7. **An Online Workshop on "Intellectual Property Rights"**
   - Type: Workshop
   - Date: May 17, 2024
   - Duration: 1 day
   - Participants: 80
   - Mode: Online

8. **Network Programming using Python by Mr. Malhar Lathkar**
   - Type: Workshop
   - Date: May 17-18, 2024
   - Duration: 2 days
   - Participants: 130
   - Mode: Offline

## How to Run the Seed Script

To add this data to your database, run:

```bash
cd server
node seed-professional-development.js
```

## Notes

- All activities are set to **"approved"** status by default
- Activities are randomly distributed among existing faculty users
- Each activity includes links to departmental activity reports
- The script clears existing professional development data before seeding (optional)

## Viewing the Data

Faculty members can view these activities in their dashboard under:
**Dashboard → Professional Development → FDP/STTP/Workshops Attended**

Coordinators and admins can also view these activities in their respective dashboards.

## Database Model

The data follows the `ProfessionalDevelopment` schema with fields:
- `faculty` (reference to User)
- `title`
- `type` (fdp, sttp, workshop, seminar, conference, training)
- `organizer`
- `duration` (in days)
- `startDate`
- `endDate`
- `mode` (online, offline, hybrid)
- `description`
- `status` (pending, approved, rejected)
- `certificateUrl` (optional)

## Future Enhancements

To add more data:
1. Edit `server/seed-professional-development.js`
2. Add new entries to the `professionalDevelopmentData` array
3. Run the seed script again

To assign activities to specific faculty members:
- Modify the script to find specific faculty by email/username
- Replace the random assignment logic with targeted assignments
