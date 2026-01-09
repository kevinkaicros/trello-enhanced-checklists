# Project Workflow

## Guiding Principles

1. **The Plan is the Source of Truth:** All work must be tracked in `plan.md`
2. **The Tech Stack is Deliberate:** Changes to the tech stack must be documented in `tech-stack.md` *before* implementation
3. **User Experience First:** Every decision should prioritize user experience
4. **Non-Interactive & CI-Aware:** Prefer non-interactive commands. Use `CI=true` for watch-mode tools (tests, linters) to ensure single execution.

## Task Workflow

All tasks follow a strict lifecycle:

### Standard Task Workflow

1. **Select Task:** Choose the next available task from `plan.md` in sequential order

2. **Mark In Progress:** Before beginning work, edit `plan.md` and change the task from `[ ]` to `[~]`

3. **Implement Feature:**
   - Write the application code necessary to implement the feature or fix the bug.
   - Focus on clean, maintainable code that follows the project's style guides.

4. **Verify Implementation:**
   - Manually verify the feature works as expected in the Trello environment.
   - Run any available automated tests to ensure no regressions.
   - Check that the implementation aligns with the requirements.

5. **Refactor (Optional but Recommended):**
   - Refactor the code to improve clarity, remove duplication, and enhance performance.
   - Ensure functionality remains intact after refactoring.

6. **Document Deviations:** If implementation differs from tech stack:
   - **STOP** implementation
   - Update `tech-stack.md` with new design
   - Add dated note explaining the change
   - Resume implementation

7. **Commit Code Changes:**
   - Stage all code changes related to the task.
   - Propose a clear, concise commit message e.g, `feat(ui): Create basic HTML structure for calculator`.
   - Perform the commit.

8. **Attach Task Summary with Git Notes:**
   - **Step 8.1: Get Commit Hash:** Obtain the hash of the *just-completed commit* (`git log -1 --format="%H"`).
   - **Step 8.2: Draft Note Content:** Create a detailed summary for the completed task. This should include the task name, a summary of changes, a list of all created/modified files, and the core "why" for the change.
   - **Step 8.3: Attach Note:** Use the `git notes` command to attach the summary to the commit.
     ```bash
     # The note content from the previous step is passed via the -m flag.
     git notes add -m "<note content>" <commit_hash>
     ```

9. **Get and Record Task Commit SHA:**
    - **Step 9.1: Update Plan:** Read `plan.md`, find the line for the completed task, update its status from `[~]` to `[x]`, and append the first 7 characters of the *just-completed commit's* commit hash.
    - **Step 9.2: Write Plan:** Write the updated content back to `plan.md`.

10. **Commit Plan Update:**
    - **Action:** Stage the modified `plan.md` file.
    - **Action:** Commit this change with a descriptive message (e.g., `conductor(plan): Mark task 'Create user model' as complete`).

### Phase Completion Verification and Checkpointing Protocol

**Trigger:** This protocol is executed immediately after a task is completed that also concludes a phase in `plan.md`.

1.  **Announce Protocol Start:** Inform the user that the phase is complete and the verification and checkpointing protocol has begun.

2.  **Verify Phase Functionality:**
    -   **Step 2.1: Determine Phase Scope:** Identify the features or changes introduced in this phase.
    -   **Step 2.2: Manual Verification:** Perform a comprehensive manual check of the features in the Trello environment to ensure they meet the phase's goals.

3.  **Propose a Detailed, Actionable Manual Verification Plan:**
    -   **CRITICAL:** To generate the plan, first analyze `product.md`, `product-guidelines.md`, and `plan.md` to determine the user-facing goals of the completed phase.
    -   You **must** generate a step-by-step plan that walks the user through the verification process, including any necessary commands and specific, expected outcomes.
    -   The plan you present to the user **must** follow this format:

        **For a Frontend/Power-Up Change:**
        ```
        For manual verification, please follow these steps:

        **Manual Verification Steps:**
        1.  **Start the development server with the command:** `http-server -p 8080` (or your specific command)
        2.  **Open Trello and navigate to:** The board where the Power-Up is enabled.
        3.  **Perform Action:** Click on the "Manage Enhanced Checklists" button.
        4.  **Confirm that you see:** The new settings panel with the updated options.
        ```

4.  **Await Explicit User Feedback:**
    -   After presenting the detailed plan, ask the user for confirmation: "**Does this meet your expectations? Please confirm with yes or provide feedback on what needs to be changed.**"
    -   **PAUSE** and await the user's response. Do not proceed without an explicit yes or confirmation.

5.  **Create Checkpoint Commit:**
    -   Stage all changes. If no changes occurred in this step, proceed with an empty commit.
    -   Perform the commit with a clear and concise message (e.g., `conductor(checkpoint): Checkpoint end of Phase X`).

6.  **Attach Auditable Verification Report using Git Notes:**
    -   **Step 6.1: Draft Note Content:** Create a detailed verification report including the manual verification steps and the user's confirmation.
    -   **Step 6.2: Attach Note:** Use the `git notes` command and the full commit hash from the previous step to attach the full report to the checkpoint commit.

7.  **Get and Record Phase Checkpoint SHA:**
    -   **Step 7.1: Get Commit Hash:** Obtain the hash of the *just-created checkpoint commit* (`git log -1 --format="%H"`).
    -   **Step 7.2: Update Plan:** Read `plan.md`, find the heading for the completed phase, and append the first 7 characters of the commit hash in the format `[checkpoint: <sha>]`.
    -   **Step 7.3: Write Plan:** Write the updated content back to `plan.md`.

8. **Commit Plan Update:**
    - **Action:** Stage the modified `plan.md` file.
    - **Action:** Commit this change with a descriptive message following the format `conductor(plan): Mark phase '<PHASE NAME>' as complete`.

9.  **Announce Completion:** Inform the user that the phase is complete and the checkpoint has been created, with the detailed verification report attached as a git note.

### Quality Gates

Before marking any task complete, verify:

- [ ] Functionality is manually verified in Trello
- [ ] Code follows project's code style guidelines (as defined in `code_styleguides/`)
- [ ] All public functions/methods are documented (e.g., JSDoc)
- [ ] No linting or static analysis errors (using the project's configured tools)
- [ ] Works correctly on mobile (if applicable)
- [ ] Documentation updated if needed
- [ ] No security vulnerabilities introduced

## Development Commands

**AI AGENT INSTRUCTION: This section should be adapted to the project's specific language, framework, and build tools.**

### Setup
```bash
npm install
```

### Daily Development
```bash
# Start local server for Trello Power-Up
http-server -p 8080
# Use ngrok for HTTPS tunneling (required for Trello)
ngrok http 8080
```

### Before Committing
```bash
# Run linting
npm run lint
```

## Testing Strategy

### Manual Testing
- **Core Focus:** Since this is a Trello Power-Up, manual testing within the Trello environment is the primary validation method.
- **Cross-Browser:** Verify functionality in Chrome, Firefox, Safari, and Edge.
- **Mobile:** Check responsiveness and usability on Trello mobile app or mobile web.

### Automated Testing (Optional)
- Unit tests can be added for complex logic in `checklist-manager.js` or `storage.js` if needed, but are not mandatory for every task.

## Code Review Process

### Self-Review Checklist
Before requesting review:

1. **Functionality**
   - Feature works as specified
   - Edge cases handled
   - Error messages are user-friendly

2. **Code Quality**
   - Follows style guide
   - DRY principle applied
   - Clear variable/function names
   - Appropriate comments

3. **Testing**
   - Manual verification passed
   - Critical paths checked

4. **Security**
   - No hardcoded secrets
   - Input validation present
   - XSS protection in place

5. **Performance**
   - Database/API queries optimized
   - Images optimized
   - Caching implemented where needed

6. **Mobile Experience**
   - Touch targets adequate (44x44px)
   - Text readable without zooming
   - Performance acceptable on mobile
   - Interactions feel native

## Commit Guidelines

### Message Format
```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Formatting, missing semicolons, etc.
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `test`: Adding missing tests
- `chore`: Maintenance tasks

### Examples
```bash
git commit -m "feat(auth): Add remember me functionality"
git commit -m "fix(posts): Correct excerpt generation for short posts"
git commit -m "style(mobile): Improve button touch targets"
```

## Definition of Done

A task is complete when:

1. All code implemented to specification
2. Manual verification passed in Trello
3. Documentation complete (if applicable)
4. Code passes all configured linting and static analysis checks
5. Works beautifully on mobile (if applicable)
6. Implementation notes added to `plan.md`
7. Changes committed with proper message
8. Git note with task summary attached to the commit

## Emergency Procedures

### Critical Bug in Production
1. Create hotfix branch from main
2. Write failing test for bug
3. Implement minimal fix
4. Test thoroughly including mobile
5. Deploy immediately
6. Document in plan.md

### Data Loss
1. Stop all write operations
2. Restore from latest backup
3. Verify data integrity
4. Document incident
5. Update backup procedures

### Security Breach
1. Rotate all secrets immediately
2. Review access logs
3. Patch vulnerability
4. Notify affected users (if any)
5. Document and update security procedures

## Deployment Workflow

### Pre-Deployment Checklist
- [ ] All tests passing
- [ ] No linting errors
- [ ] Mobile testing complete
- [ ] Environment variables configured
- [ ] Database migrations ready
- [ ] Backup created

### Deployment Steps
1. Merge feature branch to main
2. Tag release with version
3. Push to deployment service
4. Run database migrations
5. Verify deployment
6. Test critical paths
7. Monitor for errors

### Post-Deployment
1. Monitor analytics
2. Check error logs
3. Gather user feedback
4. Plan next iteration

## Continuous Improvement

- Review workflow weekly
- Update based on pain points
- Document lessons learned
- Optimize for user happiness
- Keep things simple and maintainable