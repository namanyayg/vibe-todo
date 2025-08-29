# Linear-Inspired Kanban Board

A beautiful, modern kanban board task tracker built with Next.js 14, inspired by Linear's elegant design.

## Features

- 🎯 **Linear-inspired UI** - Clean, modern interface with dark theme
- 🔄 **Drag & Drop** - Seamlessly move tasks between columns
- 📝 **Task Management** - Create, edit, and delete tasks with rich details
- 🏷️ **Labels & Priorities** - Organize tasks with custom labels and priority levels
- 👥 **Assignment** - Assign tasks to team members
- ⏱️ **Time Tracking** - Estimate and track task hours
- 💾 **Local Storage** - Data persists in your browser
- 🔍 **Search** - Quickly find tasks across all columns
- 📱 **Responsive** - Works perfectly on desktop and mobile

## Task Statuses

- **Backlog** - Ideas and future tasks
- **To Do** - Ready to start
- **In Progress** - Currently being worked on
- **In Review** - Under review
- **Done** - Completed tasks

## Priority Levels

- 🔥 **Urgent** - Critical tasks requiring immediate attention
- ⬆️ **High** - Important tasks with tight deadlines
- ➡️ **Medium** - Standard priority tasks
- ⬇️ **Low** - Nice-to-have tasks

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### Creating Tasks
- Click the **"Add Task"** button in the header or the **"+"** button in any column
- Fill in task details including title, description, priority, assignee, and labels
- Set estimated hours for better project planning

### Moving Tasks
- **Drag and drop** tasks between columns to change their status
- **Drag within columns** to reorder tasks by priority

### Editing Tasks
- Click on any task title to open the edit modal
- Update any task properties and save changes

### Search & Filter
- Use the search bar to find tasks by title, description, or assignee
- Results are filtered across all columns in real-time

## Technology Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **@dnd-kit** - Drag and drop functionality
- **Lucide React** - Beautiful icons
- **Local Storage** - Client-side data persistence

## Project Structure

```
src/
├── app/
│   ├── globals.css      # Global styles and Tailwind imports
│   ├── layout.tsx       # Root layout component
│   └── page.tsx         # Main kanban board page
├── components/
│   ├── KanbanColumn.tsx # Column component with drag/drop
│   ├── TaskCard.tsx     # Individual task card
│   └── TaskModal.tsx    # Task creation/editing modal
├── hooks/
│   └── useLocalStorage.ts # Local storage hook
└── types/
    └── task.ts          # TypeScript type definitions
```

## Customization

The app uses CSS custom properties for easy theming. Key colors are defined in `tailwind.config.js`:

- `linear-bg` - Main background color
- `linear-card` - Card backgrounds
- `linear-border` - Border color
- `linear-text` - Text color
- `linear-purple` - Primary accent color

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).