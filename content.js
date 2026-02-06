(function() {
    'use strict';

    // --- Constants ---
    const GITHUB_DOMAIN = 'github.com';
    const PULL_REQUEST_PATH_IDENTIFIER = '/pull/';
    const PROJECT_NAME_SELECTOR = 'context-region-crumb:nth-of-type(2) .AppHeader-context-item-label';
    const TASK_NAME_SELECTOR = '.markdown-title';
    const HEADER_ACTIONS_SELECTOR = '[data-component="PH_Actions"]';
    const BUTTON_ID = 'ort-copy-task-btn';
    const BUTTON_CLASS_LIST = ['Button', 'Button--primary', 'Button--small'];
    const BUTTON_TEXT = 'Generate ORT Report';
    const BUTTON_TEXT_SUCCESS = 'Copied!';
    const BUTTON_TEXT_ERROR = 'Error!';
    const SUCCESS_DISPLAY_DURATION_MS = 1200;

    // --- Utility Functions ---

    /**
     * Extracts the base URL of the pull request, removing any extra path segments.
     * @returns {string} The clean pull request URL.
     */
    function getCleanPullRequestUrl() {
        const prUrlMatch = window.location.href.match(/(.*\/pull\/\d+)/);
        return prUrlMatch ? prUrlMatch[0] : window.location.href;
    }

    /**
     * Fetches the project name from the page header.
     * @returns {string} The formatted project name.
     */
    function getProjectName() {
        const el = document.querySelector(PROJECT_NAME_SELECTOR);
        const content = el?.textContent.trim() ?? '';
        // Format from "project-name" to "Project Name"
        return content
            .split('-')
            .map(item => item.charAt(0).toUpperCase() + item.slice(1).trim())
            .join(' ');
    }

    /**
     * Fetches the task/pull request title from the page.
     * @returns {string} The task name.
     */
    function getTaskName() {
        const el = document.querySelector(TASK_NAME_SELECTOR);
        return el?.textContent.trim() ?? '';
    }

    /**
     * Creates the task message string based on a template.
     * @param {object} prData - The pull request data.
     * @param {string} prData.projectName - The name of the project.
     * @param {string} prData.taskName - The name of the task/PR.
     * @param {string} prData.url - The URL of the PR.
     * @returns {string} The formatted task message.
     */
    function createTaskMessage(prData) {
        return `
[Project] ${prData.projectName}
[Task] ${prData.taskName}
[Assignee] @ort-frontend
[Reference] ${prData.url}
  `.trim();
    }

    /**
     * Handles the click event on the copy button.
     * @param {MouseEvent} event - The click event.
     */
    async function handleCopyClick(event) {
        const button = event.currentTarget;
        try {
            const prData = {
                projectName: getProjectName(),
                taskName: getTaskName(),
                url: getCleanPullRequestUrl(),
            };
            const taskMessage = createTaskMessage(prData);
            await navigator.clipboard.writeText(taskMessage);

            button.textContent = BUTTON_TEXT_SUCCESS;
        } catch (error) {
            console.error('Failed to copy task report:', error);
            button.textContent = BUTTON_TEXT_ERROR;
        } finally {
            setTimeout(() => {
                button.textContent = BUTTON_TEXT;
            }, SUCCESS_DISPLAY_DURATION_MS);
        }
    }

    /**
     * Creates and returns the "Generate ORT Report" button.
     * @returns {HTMLButtonElement} The created button element.
     */
    function createCopyButton() {
        const btn = document.createElement('button');
        btn.id = BUTTON_ID;
        btn.textContent = BUTTON_TEXT;
        btn.classList.add(...BUTTON_CLASS_LIST);
        btn.style.marginRight = '4px';
        btn.onclick = handleCopyClick;
        return btn;
    }

    /**
     * Finds the header actions container and injects the copy button if it doesn't exist.
     * This function is idempotent and safe to call multiple times.
     */
    function addCopyButtonToPage() {
        const isGitHub = window.location.hostname === GITHUB_DOMAIN;
        const isPullRequest = window.location.pathname.includes(PULL_REQUEST_PATH_IDENTIFIER);

        if (!isGitHub || !isPullRequest) {
            return;
        }

        const headerActions = document.querySelector(HEADER_ACTIONS_SELECTOR);
        if (!headerActions || document.getElementById(BUTTON_ID)) {
            return;
        }

        const button = createCopyButton();
        headerActions.prepend(button);
    }


    // --- Main Execution ---

    /**
     * Initializes the script. It attempts to add the button immediately
     * and sets up a MutationObserver to handle dynamic page loads (like soft navigation).
     */
    function init() {
        // Attempt to add the button on initial page load.
        addCopyButtonToPage();

        // Observe for DOM changes to handle cases where the header is loaded dynamically,
        // which is common in single-page applications like GitHub.
        const observer = new MutationObserver(() => {
            addCopyButtonToPage();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    init();

})();
