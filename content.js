const domain = window.location.hostname;
const buttonLabel = 'Create ORT Task';
const timeout = 1200;

const contents = {
  projectName: getProjectName(),
  taskName: getTaskName(),
  url: window.location.href,
};

const generateTask = async () => {
  if (domain !== "github.com") {
    alert("This script only works on GitHub.");

    return;
  }

  const template = `
[Project] ${contents.projectName}
[Task] ${contents.taskName}
[Assignee] @ort-frontend
[Reference] ${contents.url}
  `;

  await navigator.clipboard.writeText(template.trim());
}

function getProjectName() {
  const selectors =
    "context-region-crumb:nth-of-type(2) .AppHeader-context-item-label";
  const el = document.querySelector(selectors);

  const content = el?.textContent.trim() ?? "";

  const formatContent = content
    .split("-")
    .map((item) => item.charAt(0).toUpperCase() + item.slice(1).trim())
    .join(" ");

  return formatContent
}

function getTaskName() {
  const el = document.querySelector(".markdown-title");

  const content = el?.textContent.trim() ?? "";

  return content
}

const btnStyle = {
  padding: '8px 16px',
  background: '#1976d2',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
}

const btn = document.createElement('button');
btn.textContent = buttonLabel;
Object.assign(btn.style, btnStyle);

btn.onclick = async function () {
  try {
    await generateTask();
    btn.textContent = 'Copied!';
    setTimeout(() => btn.textContent = buttonLabel, timeout);
  } catch (error) {
    btn.textContent = 'Error!';
    setTimeout(() => btn.textContent = buttonLabel, timeout);
  }
};

document.querySelector('.gh-header-actions').prepend(btn);

