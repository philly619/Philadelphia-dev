<!DOCTYPE html>
<html lang="en">
<head>

    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <title>
        Philadelphia Developer Dashboard
    </title>

    <!-- CSS -->

    <link
        rel="stylesheet"
        href="styles.css"
    >

    <!-- PDF LIBRARY -->

    <script
        src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js">
    </script>

</head>

<body>

    <!-- LOGIN -->

    <section id="login-section">

        <div class="login-box">

            <h1>
                Philadelphia Developer Dashboard
            </h1>

            <p>
                Portfolio + CV Builder + Job Tracker
            </p>

            <button id="github-login">
                Login With GitHub
            </button>

        </div>

    </section>

    <!-- DASHBOARD -->

    <section
        id="dashboard-section"
        class="hidden"
    >

        <!-- SIDEBAR -->

        <aside class="sidebar">

            <h2>Dashboard</h2>

            <ul>

                <li>
                    <a href="#portfolio">
                        Portfolio
                    </a>
                </li>

                <li>
                    <a href="#cv-builder">
                        CV Builder
                    </a>
                </li>

                <li>
                    <a href="#jobs">
                        Job Tracker
                    </a>
                </li>

                <li>
                    <a href="#saved-jobs">
                        Saved Jobs
                    </a>
                </li>

            </ul>

            <button id="theme-toggle">
                Toggle Theme
            </button>

            <button id="logout-btn">
                Logout
            </button>

        </aside>

        <!-- MAIN -->

        <main class="main-content">

            <!-- PROFILE -->

            <section class="card">

                <h1>User Profile</h1>

                <img
                    id="profile-image"
                    class="profile-image"
                >

                <h3 id="profile-name"></h3>

            </section>

            <!-- PORTFOLIO -->

            <section
                class="card"
                id="portfolio"
            >

                <h1>My Portfolio</h1>

                <p>
                    Open your portfolio website.
                </p>

                <a
                    href="https://philly619.github.io/Philadelphia-dev/"
                    target="_blank"
                    class="portfolio-btn"
                >
                    Open Portfolio
                </a>

            </section>

            <!-- CV BUILDER -->

            <section
                class="card"
                id="cv-builder"
            >

                <h1>CV Builder</h1>

                <input
                    type="text"
                    id="full-name"
                    placeholder="Full Name"
                >

                <input
                    type="text"
                    id="job-title"
                    placeholder="Job Title"
                >

                <textarea
                    id="summary"
                    placeholder="Professional Summary"
                ></textarea>

                <textarea
                    id="skills"
                    placeholder="Skills"
                ></textarea>

                <button id="generate-cv">
                    Generate CV
                </button>

                <button id="download-cv">
                    Download PDF
                </button>

                <div id="cv-preview"></div>

            </section>

            <!-- JOB TRACKER -->

            <section
                class="card"
                id="jobs"
            >

                <h1>Job Application Tracker</h1>

                <input
                    type="text"
                    id="company"
                    placeholder="Company Name"
                >

                <input
                    type="text"
                    id="role"
                    placeholder="Job Role"
                >

                <select id="status">

                    <option value="Applied">
                        Applied
                    </option>

                    <option value="Interview">
                        Interview
                    </option>

                    <option value="Rejected">
                        Rejected
                    </option>

                </select>

                <button id="save-job">
                    Save Job
                </button>

                <div id="job-list"></div>

            </section>

            <!-- SAVED JOBS -->

            <section
                class="card"
                id="saved-jobs"
            >

                <h1>Saved Jobs</h1>

                <div id="saved-jobs-list">

                    <div class="saved-job">
                        Frontend Developer - Remote
                    </div>

                    <div class="saved-job">
                        Full Stack Engineer - Europe
                    </div>

                </div>

            </section>

        </main>

    </section>

    <!-- JS -->

    <script
        type="module"
        src="style.js"
    ></script>

</body>
</html>
