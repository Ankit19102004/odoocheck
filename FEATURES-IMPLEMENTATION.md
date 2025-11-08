# 🚀 New Features Implementation Plan

## ✅ Completed Fixes

### 1. Project Creation
- ✅ Created `NewProject.tsx` component
- ✅ Added route `/projects/new` in App.tsx
- ✅ Form with all project fields (name, description, manager, deadline, priority, budget, status, tags)
- ✅ Integrated with backend API

### 2. Member Management (Add/Delete/Edit)
- ✅ Added `createUser` endpoint in backend
- ✅ Added `deleteUser` endpoint in backend
- ✅ Updated `Team.tsx` with full CRUD functionality
- ✅ Modal form for adding/editing users
- ✅ Delete confirmation dialog
- ✅ Role-based access control (admin only)

---

## 🆕 New Features to Implement

### 1. Budget Overrun Alert
**Description:** Alert system that monitors project budgets and sends notifications when expenses exceed budget thresholds.

**Implementation:**
- Backend: Add budget monitoring logic in analytics controller
- Frontend: Budget alert component in project detail page
- Real-time alerts when budget exceeds 80%, 90%, 100%
- Alert notifications in dashboard

**Database Changes:**
- Add `budget_alerts` table (optional - can use existing budget field)
- Track budget vs actual expenses

**Files to Create/Modify:**
- `oneflow-ui/src/components/BudgetAlert.tsx`
- `oneflow-api/src/controllers/budgetAlertController.ts`
- Update `ProjectDetail.tsx` to show budget alerts
- Update `Dashboard.tsx` to show budget alerts

---

### 2. Skill Based Task Assignment
**Description:** Assign tasks to users based on their skills and expertise.

**Implementation:**
- Backend: Add `skills` field to User model (JSON or separate table)
- Backend: Add `required_skills` field to Task model
- Frontend: Skill selection when creating/editing tasks
- Frontend: Skill matching algorithm to suggest best assignees
- Frontend: User skills management in user profile

**Database Changes:**
- Add `user_skills` table (user_id, skill_name, proficiency_level)
- Add `task_required_skills` table (task_id, skill_name) OR JSON field in tasks

**Files to Create/Modify:**
- Migration: `create-user-skills.js`
- Migration: `add-task-skills.js`
- `oneflow-api/src/models/UserSkill.ts`
- `oneflow-api/src/models/TaskSkill.ts`
- `oneflow-ui/src/components/SkillSelector.tsx`
- `oneflow-ui/src/components/TaskAssigneeSuggestions.tsx`
- Update `Task` creation/editing forms

---

### 3. Delay Track with Risk Alert
**Description:** Track task delays and project deadlines, alert when delays pose risks.

**Implementation:**
- Backend: Calculate task delay based on deadline vs current date
- Backend: Calculate project delay risk based on task delays
- Frontend: Delay indicator on tasks and projects
- Frontend: Risk alert badges (low, medium, high, critical)
- Frontend: Delay tracking dashboard

**Database Changes:**
- Add `delay_tracking` table (optional - calculate on the fly)
- Add `risk_level` field to tasks and projects

**Files to Create/Modify:**
- `oneflow-api/src/utils/delayTracker.ts`
- `oneflow-api/src/utils/riskCalculator.ts`
- `oneflow-ui/src/components/DelayIndicator.tsx`
- `oneflow-ui/src/components/RiskAlert.tsx`
- Update `TaskCard.tsx` to show delays
- Update `ProjectCard.tsx` to show risk levels

---

### 4. Unified Workspace
**Description:** Centralized workspace that consolidates all project information, tasks, documents, and communications in one place.

**Implementation:**
- Frontend: New workspace page with multiple views
- Frontend: Project overview, tasks, team, documents, timeline
- Frontend: Filtering and sorting capabilities
- Frontend: Quick actions (create task, add member, etc.)
- Backend: Aggregated data endpoint for workspace

**Files to Create/Modify:**
- `oneflow-ui/src/pages/Workspace.tsx`
- `oneflow-ui/src/pages/Workspace.css`
- `oneflow-ui/src/components/WorkspaceView.tsx`
- `oneflow-api/src/controllers/workspaceController.ts`
- `oneflow-api/src/routes/workspace.ts`
- Update navigation to include Workspace

---

## 📋 Implementation Order

1. **Budget Overrun Alert** (Easiest - uses existing budget/expense data)
2. **Delay Track with Risk Alert** (Medium - requires date calculations)
3. **Skill Based Task Assignment** (Medium - requires database changes)
4. **Unified Workspace** (Complex - requires multiple components)

---

## 🗄️ Database Schema Changes

### User Skills Table
```sql
CREATE TABLE user_skills (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  skill_name VARCHAR(100) NOT NULL,
  proficiency_level ENUM('beginner', 'intermediate', 'advanced', 'expert') DEFAULT 'intermediate',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_skill (user_id, skill_name)
);
```

### Task Required Skills
```sql
ALTER TABLE tasks ADD COLUMN required_skills JSON NULL;
-- OR
CREATE TABLE task_required_skills (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  task_id INT UNSIGNED NOT NULL,
  skill_name VARCHAR(100) NOT NULL,
  FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
);
```

### Budget Alerts (Optional)
```sql
CREATE TABLE budget_alerts (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  project_id INT UNSIGNED NOT NULL,
  threshold_percentage INT NOT NULL,
  alerted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);
```

---

## 🎯 Next Steps

1. Start implementing Budget Overrun Alert
2. Create database migrations for new features
3. Implement backend APIs
4. Create frontend components
5. Test all features
6. Update documentation

---

## 📝 Notes

- All features should respect role-based access control
- Alerts should be configurable (thresholds, notification preferences)
- Skills system should be flexible and extensible
- Workspace should be customizable per user
- All features should be mobile-responsive

