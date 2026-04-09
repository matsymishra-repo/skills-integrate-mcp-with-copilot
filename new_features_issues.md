# New Features Issues for skills-integrate-mcp-with-copilot

Based on the comparison with the master_timetable repository, here are the new features to implement. Create GitHub issues for each with the following titles and descriptions.

## Issue 1: Add Timetable Grid View
**Title:** Implement Timetable Grid View for Weekly Schedule

**Description:**
Add a weekly timetable grid view (Mon-Fri) with time slots (e.g., 8:00 AM - 4:00 PM) to display activities in a calendar-like format. This would complement the current card-based activity listing.

- Create a new endpoint or page for the timetable.
- Use HTML table or a JS library for the grid.
- Integrate with existing activity data to show scheduled times.

**Labels:** enhancement, frontend, feature

## Issue 2: Add Year Group Differentiation
**Title:** Support Year Group Differentiation for Activities

**Description:**
Allow activities to be filtered or assigned by year group (e.g., Yr.7-Yr.11). Currently, the app doesn't use the grade level in student data.

- Update the activity data model to include year groups.
- Modify the API to filter activities by year.
- Update the frontend to show year-specific options.

**Labels:** enhancement, backend, feature

## Issue 3: Add Room Assignments
**Title:** Include Room Assignments for Activities

**Description:**
Add room numbers to activities (e.g., "Art Club in room 18"). This would help with logistics and planning.

- Add "room" field to activity data.
- Display room in activity cards and details.
- Update sign-up logic if needed for room capacity.

**Labels:** enhancement, backend, frontend

## Issue 4: Integrate Academic + Extracurricular Schedule
**Title:** Integrate Academic Classes with Extracurricular Schedule

**Description:**
Expand the app to include academic class schedules alongside extracurricular activities, providing a full school day view.

- Add academic subjects to the data model.
- Create a combined timetable view.
- Ensure activities don't conflict with classes.

**Labels:** enhancement, feature, major

## Issue 5: Add Dedicated Extracurricular Time Slots
**Title:** Add Dedicated Time Slots for Extracurricular Activities

**Description:**
Embed specific time slots for extracurricular activities (e.g., "CLUBS" on Wed afternoons) into the schedule.

- Define standard extracurricular slots.
- Allow activities to be assigned to these slots.
- Update the timetable to show these.

**Labels:** enhancement, frontend, feature

## Issue 6: Add Form Tutor Time
**Title:** Implement Form Tutor Time Slots

**Description:**
Add recurring slots for form tutor/advisory time, similar to homeroom sessions.

- Add "Form Tutor Time" as a special activity type.
- Schedule it daily or weekly.
- Display in the timetable.

**Labels:** enhancement, feature

## Issue 7: Add Morning Devotion Slot
**Title:** Add Morning Devotion Slot

**Description:**
Include a special morning devotion/assembly slot, e.g., on Mondays.

- Add devotion as a non-sign-up activity.
- Display in the timetable.
- Make it school-specific.

**Labels:** enhancement, feature

## Issue 8: Add Static, Printable Format
**Title:** Provide Static, Printable Timetable Format

**Description:**
Allow exporting or viewing the timetable in a static, printable HTML format without dynamic elements.

- Create a print-friendly CSS.
- Add a "Print" button or static page.
- Ensure no JS dependencies for printing.

**Labels:** enhancement, frontend, accessibility

## Issue 9: Improve Accessibility Enhancements
**Title:** Enhance Accessibility for Timetable and Activities

**Description:**
Improve accessibility with better semantic HTML, ARIA labels, and table structures.

- Add ARIA attributes to forms and tables.
- Ensure keyboard navigation.
- Test with screen readers.

**Labels:** enhancement, accessibility, frontend

## Issue 10: Expand Scope to Broader School Scheduling
**Title:** Expand App Scope to Full School Scheduling

**Description:**
Broaden the app from extracurricular-only to include full academic scheduling, making it a comprehensive school planner.

- Integrate classes, breaks, and activities.
- Add teacher assignments.
- Update data model for full scope.

**Labels:** enhancement, major, feature</content>
<parameter name="filePath">/workspaces/skills-integrate-mcp-with-copilot/new_features_issues.md