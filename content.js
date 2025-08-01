const domain = window.location.hostname;

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

const btn = document.createElement('button');
btn.textContent = 'Copy Link';
btn.style.position = 'fixed';
btn.style.bottom = '20px';
btn.style.right = '20px';
btn.style.zIndex = 9999;
btn.style.padding = '8px 16px';
btn.style.background = '#1976d2';
btn.style.color = '#fff';
btn.style.border = 'none';
btn.style.borderRadius = '4px';
btn.style.cursor = 'pointer';
btn.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';

btn.onclick = async function () {
  try {
    await generateTask();
    btn.textContent = 'Copied!';
    setTimeout(() => btn.textContent = 'Copy Link', 1200);
  } catch (error) {
    btn.textContent = 'Error!';
    setTimeout(() => btn.textContent = 'Copy Link', 1200);
  }
};

document.body.appendChild(btn);

