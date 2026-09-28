import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { usePatients } from "../context/PatientContext";

import {
    Activity,
    ArrowDown,
    ArrowLeft,
    ArrowRight,
    Pause,
    Play,
    RotateCcw,
    Square,
    Timer,
    Zap,
} from "lucide-react";

import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

// =========================================
// HELPERS
// =========================================

function getInitials(name) {
    return name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
}

function formatTime(totalSeconds) {
    const minutes = Math.floor(
        totalSeconds / 60
    );

    const seconds =
        totalSeconds % 60;

    return `${String(minutes).padStart(
        2,
        "0"
    )}:${String(seconds).padStart(
        2,
        "0"
    )}`;
}

// =========================================
// MAIN PAGE
// =========================================

function LiveSession() {
    const {
        selectedPatient,
    } = usePatients();

    const navigate = useNavigate();

    if (!selectedPatient) {
        return (
            <div className="page">

                <div className="page-header">

                    <div>

                        <p className="breadcrumb">
                            Therapy Session
                        </p>

                        <h2>
                            No Patient Selected
                        </h2>

                        <p className="subtitle">
                            Please select a patient before
                            starting a therapy session.
                        </p>

                    </div>

                </div>

                <button
                    className="primary-action"
                    onClick={() =>
                        navigate("/patients")
                    }
                >
                    Back to Patients
                </button>

            </div>
        );
    }

    return (
        <LiveSessionContent
            key={selectedPatient.id}
            patient={selectedPatient}
        />
    );
}

// =========================================
// LIVE SESSION CONTENT
// =========================================

function LiveSessionContent({
    patient,
}) {
    const {
        addSessionToPatient,
    } = usePatients();

    const navigate = useNavigate();

    // =========================================
    // TELEMETRY PROFILE
    // =========================================

    const telemetryProfile =
        patient.telemetry || {
            baseline: 2.4,
            min: 1.8,
            max: 3.0,
            variation: 0.12,
        };

    // =========================================
    // STATE
    // =========================================

    // Session does NOT start automatically.
    const [
        sessionStarted,
        setSessionStarted,
    ] = useState(false);

    const [
        isRunning,
        setIsRunning,
    ] = useState(false);

    const [
        elapsedSeconds,
        setElapsedSeconds,
    ] = useState(0);

    const [
        intensity,
        setIntensity,
    ] = useState(
        telemetryProfile.baseline
    );

    const [
        direction,
        setDirection,
    ] = useState("LEFT");

    const [
        telemetry,
        setTelemetry,
    ] = useState([
        {
            time: "00:00",
            intensity:
                telemetryProfile.baseline,
            direction: "LEFT",
        },
    ]);

    const [
        sessionEnded,
        setSessionEnded,
    ] = useState(false);

    const [
        isSaving,
        setIsSaving,
    ] = useState(false);

    const [
        saveError,
        setSaveError,
    ] = useState(null);

    // =========================================
    // GENERATE NEXT INTENSITY
    // =========================================

    function getNextIntensity(
        currentIntensity
    ) {
        const change =
            (Math.random() - 0.5) *
            telemetryProfile.variation *
            2;

        const nextValue =
            currentIntensity +
            change;

        return Math.min(
            telemetryProfile.max,
            Math.max(
                telemetryProfile.min,
                nextValue
            )
        );
    }

    // =========================================
    // GENERATE NEXT DIRECTION
    // =========================================

    function getRandomDirection(
        currentDirection
    ) {
        const directions = [
            "LEFT",
            "RIGHT",
            "FORWARD",
        ];

        if (Math.random() > 0.18) {
            return currentDirection;
        }

        const availableDirections =
            directions.filter(
                (item) =>
                    item !==
                    currentDirection
            );

        return availableDirections[
            Math.floor(
                Math.random() *
                    availableDirections.length
            )
        ];
    }

    // =========================================
    // TELEMETRY SIMULATION
    // =========================================

    useEffect(() => {
        if (
            !sessionStarted ||
            !isRunning ||
            sessionEnded
        ) {
            return;
        }

        const interval =
            setInterval(() => {
                setElapsedSeconds(
                    (currentSeconds) => {
                        const nextSeconds =
                            currentSeconds +
                            1;

                        setIntensity(
                            (
                                currentIntensity
                            ) => {
                                const nextIntensity =
                                    getNextIntensity(
                                        currentIntensity
                                    );

                                setDirection(
                                    (
                                        currentDirection
                                    ) => {
                                        const nextDirection =
                                            getRandomDirection(
                                                currentDirection
                                            );

                                        setTelemetry(
                                            (
                                                currentTelemetry
                                            ) => [
                                                ...currentTelemetry.slice(
                                                    -29
                                                ),

                                                {
                                                    time:
                                                        formatTime(
                                                            nextSeconds
                                                        ),

                                                    intensity:
                                                        Number(
                                                            nextIntensity.toFixed(
                                                                2
                                                            )
                                                        ),

                                                    direction:
                                                        nextDirection,
                                                },
                                            ]
                                        );

                                        return nextDirection;
                                    }
                                );

                                return nextIntensity;
                            }
                        );

                        return nextSeconds;
                    }
                );
            }, 1000);

        return () =>
            clearInterval(
                interval
            );
    }, [
        sessionStarted,
        isRunning,
        sessionEnded,
    ]);

    // =========================================
    // START SESSION
    // =========================================

    function handleStartSession() {
        setSaveError(null);
        setSessionStarted(true);
        setIsRunning(true);
    }

    // =========================================
    // END SESSION
    // =========================================

    async function handleEndSession() {
        if (
            !sessionStarted ||
            sessionEnded ||
            isSaving
        ) {
            return;
        }

        setIsRunning(false);
        setIsSaving(true);
        setSaveError(null);

        // =====================================
        // CALCULATE SESSION STATISTICS
        // =====================================

        const intensityValues =
            telemetry.map(
                (point) =>
                    point.intensity
            );

        const averageIntensity =
            intensityValues.reduce(
                (
                    total,
                    value
                ) =>
                    total + value,
                0
            ) /
            intensityValues.length;

        const peakIntensity =
            Math.max(
                ...intensityValues
            );

        const minimumIntensity =
            Math.min(
                ...intensityValues
            );

        const directionCounts =
            telemetry.reduce(
                (
                    counts,
                    point
                ) => {
                    counts[
                        point.direction
                    ] =
                        (
                            counts[
                                point.direction
                            ] || 0
                        ) + 1;

                    return counts;
                },
                {}
            );

        const dominantDirection =
            Object.entries(
                directionCounts
            ).sort(
                (a, b) =>
                    b[1] - a[1]
            )[0]?.[0] ||
            direction;

        // =====================================
        // UNIQUE SESSION CODE
        // =====================================

        const sessionCode =
            `S-${Date.now()}`;

        // =====================================
        // COMPLETED SESSION
        // =====================================

        const completedSession = {
            id:
                sessionCode,

            date:
                new Date().toLocaleDateString(
                    "en-US",
                    {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                    }
                ),

            duration:
                formatTime(
                    elapsedSeconds
                ),

            intensity:
                `${averageIntensity.toFixed(
                    1
                )} mA`,

            averageIntensity:
                Number(
                    averageIntensity.toFixed(
                        2
                    )
                ),

            peakIntensity:
                Number(
                    peakIntensity.toFixed(
                        2
                    )
                ),

            minimumIntensity:
                Number(
                    minimumIntensity.toFixed(
                        2
                    )
                ),

            dominantDirection,

            status:
                "Completed",

            telemetry:
                telemetry,
        };

        // =====================================
        // SAVE TO DATABASE
        // =====================================

        try {
            /*
             * PatientContext handles:
             *
             * 1. POST /api/sessions
             * 2. POST telemetry readings
             * 3. Reload patients
             *
             * SQLite remains the single
             * source of truth.
             */

            await addSessionToPatient(
                patient.id,
                completedSession
            );

            // =================================
            // SESSION SAVED SUCCESSFULLY
            // =================================

            setSessionEnded(true);

            // =================================
            // OPEN SESSION SUMMARY
            // =================================

            navigate(
                "/session/summary",
                {
                    state: {
                        session:
                            completedSession,

                        patient:
                            patient,
                    },
                }
            );

        } catch (error) {
            console.error(
                "Failed to save session:",
                error
            );

            setSaveError(
                error.message ||
                    "The session could not be saved to the database."
            );

            setIsRunning(true);

        } finally {
            setIsSaving(false);
        }
    }

    // =========================================
    // RESTART DEMO
    // =========================================

    function handleRestart() {
        const baseline =
            telemetryProfile.baseline;

        setSessionStarted(false);
        setIsRunning(false);
        setSessionEnded(false);
        setElapsedSeconds(0);

        setIntensity(
            baseline
        );

        setDirection(
            "LEFT"
        );

        setSaveError(
            null
        );

        setTelemetry([
            {
                time: "00:00",
                intensity:
                    baseline,
                direction:
                    "LEFT",
            },
        ]);
    }

    // =========================================
    // DIRECTION ICON
    // =========================================

    function getDirectionIcon() {
        if (
            direction === "LEFT"
        ) {
            return (
                <ArrowLeft
                    size={21}
                />
            );
        }

        if (
            direction === "RIGHT"
        ) {
            return (
                <ArrowRight
                    size={21}
                />
            );
        }

        return (
            <ArrowDown
                size={21}
            />
        );
    }

    // =========================================
    // UI
    // =========================================

    return (
        <div className="page">

            {/* =========================
                PAGE HEADER
            ========================= */}

            <div className="page-header">

                <div>

                    <p className="breadcrumb">
                        Therapy Session
                    </p>

                    <h2>
                        Live Therapy Session
                    </h2>

                    <p className="subtitle">
                        Real-time vestibular
                        rehabilitation telemetry
                    </p>

                </div>

                <div className="session-header-status">

                    <span
                        className={`session-status-dot ${
                            sessionEnded
                                ? "ended"
                                : !sessionStarted
                                ? "paused"
                                : !isRunning
                                ? "paused"
                                : ""
                        }`}
                    />

                    {sessionEnded
                        ? "Session Ended"
                        : !sessionStarted
                        ? "Ready to Start"
                        : isRunning
                        ? "Session Active"
                        : "Session Paused"}

                </div>

            </div>

            {/* =========================
                CURRENT PATIENT
            ========================= */}

            <div className="session-patient-bar">

                <div className="session-patient">

                    <div className="large-avatar">

                        {getInitials(
                            patient.name
                        )}

                    </div>

                    <div>

                        <span className="card-label">
                            CURRENT PATIENT
                        </span>

                        <h3>
                            {patient.name}
                        </h3>

                        <p>
                            {patient.id}
                            {" · "}
                            {patient.age}
                            {" years · "}
                            {patient.gender}
                        </p>

                    </div>

                </div>

                <div className="simulation-badge">

                    <Activity
                        size={15}
                    />

                    Dummy Telemetry

                </div>

            </div>

            {/* =========================
                SAVE ERROR
            ========================= */}

            {saveError && (
                <div
                    style={{
                        marginBottom:
                            "16px",

                        padding:
                            "12px 16px",

                        borderRadius:
                            "8px",

                        background:
                            "#fff1f1",

                        border:
                            "1px solid #f1caca",

                        color:
                            "#b42318",

                        fontSize:
                            "13px",
                    }}
                >
                    {saveError}
                </div>
            )}

            {/* =========================
                LIVE METRICS
            ========================= */}

            <div className="live-metrics">

                {/* Current Intensity */}

                <div className="live-metric-card">

                    <div className="live-metric-icon blue">

                        <Zap
                            size={22}
                        />

                    </div>

                    <div>

                        <span>
                            CURRENT INTENSITY
                        </span>

                        <strong>

                            {intensity.toFixed(
                                2
                            )}

                            <small>
                                {" "}
                                mA
                            </small>

                        </strong>

                        <p>
                            Simulated stimulation
                            level
                        </p>

                    </div>

                </div>

                {/* Current Direction */}

                <div className="live-metric-card">

                    <div className="live-metric-icon purple">

                        {getDirectionIcon()}

                    </div>

                    <div>

                        <span>
                            CURRENT DIRECTION
                        </span>

                        <strong className="direction-value">

                            {direction.charAt(
                                0
                            ) +
                                direction
                                    .slice(1)
                                    .toLowerCase()}

                        </strong>

                        <p>
                            Detected sway direction
                        </p>

                    </div>

                </div>

                {/* Session Time */}

                <div className="live-metric-card">

                    <div className="live-metric-icon green">

                        <Timer
                            size={22}
                        />

                    </div>

                    <div>

                        <span>
                            SESSION TIME
                        </span>

                        <strong>

                            {formatTime(
                                elapsedSeconds
                            )}

                        </strong>

                        <p>

                            {sessionEnded
                                ? "Session completed"
                                : isSaving
                                ? "Saving session..."
                                : !sessionStarted
                                ? "Ready to start"
                                : isRunning
                                ? "Recording telemetry"
                                : "Telemetry paused"}

                        </p>

                    </div>

                </div>

            </div>

            {/* =========================
                TELEMETRY
            ========================= */}

            <div className="telemetry-panel">

                <div className="telemetry-header">

                    <div>

                        <span className="card-label">
                            REAL-TIME TELEMETRY
                        </span>

                        <h3>
                            Simulation Intensity
                        </h3>

                        <p>
                            Live simulated intensity
                            measurements during the
                            session
                        </p>

                    </div>

                    <div className="telemetry-live">

                        <span className="status-dot" />

                        {sessionEnded
                            ? "ENDED"
                            : !sessionStarted
                            ? "READY"
                            : isRunning
                            ? "LIVE"
                            : "PAUSED"}

                    </div>

                </div>

                <div className="telemetry-chart">

                    <ResponsiveContainer
                        width="100%"
                        height="100%"
                    >

                        <LineChart
                            data={telemetry}
                        >

                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#e8edf2"
                            />

                            <XAxis
                                dataKey="time"
                                tick={{
                                    fontSize: 9,
                                    fill: "#8995a2",
                                }}
                                tickLine={false}
                                axisLine={{
                                    stroke:
                                        "#dfe5ea",
                                }}
                            />

                            <YAxis
                                domain={[
                                    Math.max(
                                        1,
                                        telemetryProfile.min -
                                            0.25
                                    ),
                                    telemetryProfile.max +
                                        0.25,
                                ]}
                                tick={{
                                    fontSize: 9,
                                    fill: "#8995a2",
                                }}
                                tickLine={false}
                                axisLine={{
                                    stroke:
                                        "#dfe5ea",
                                }}
                            />

                            <Tooltip
                                contentStyle={{
                                    fontSize:
                                        "11px",

                                    borderRadius:
                                        "6px",

                                    border:
                                        "1px solid #e4e9ef",

                                    boxShadow:
                                        "0 4px 12px rgba(0, 0, 0, 0.08)",
                                }}
                            />

                            <Line
                                type="monotone"
                                dataKey="intensity"
                                stroke="#2878d2"
                                strokeWidth={
                                    2.5
                                }
                                dot={false}
                                activeDot={{
                                    r: 4,
                                }}
                            />

                        </LineChart>

                    </ResponsiveContainer>

                </div>

            </div>

            {/* =========================
                SESSION CONTROLS
            ========================= */}

            <div className="session-controls">

                <div className="control-info">

                    <span className="card-label">
                        SESSION CONTROL
                    </span>

                    <h3>

                        {sessionEnded
                            ? "Session completed"
                            : isSaving
                            ? "Saving session"
                            : !sessionStarted
                            ? "Ready to start"
                            : isRunning
                            ? "Telemetry recording"
                            : "Telemetry paused"}

                    </h3>

                    <p>

                        {sessionEnded
                            ? "Session data has been saved."
                            : isSaving
                            ? "Saving session and telemetry data to the backend."
                            : !sessionStarted
                            ? "Press Start Session when you are ready to begin telemetry recording."
                            : "Control the simulated therapy telemetry session."}

                    </p>

                </div>

                <div className="control-actions">

                    {!sessionEnded ? (

                        !sessionStarted ? (

                            <button
                                className="primary-action"
                                onClick={
                                    handleStartSession
                                }
                            >

                                <Play
                                    size={15}
                                />

                                Start Session

                            </button>

                        ) : (

                            <>

                                <button
                                    className="pause-button"
                                    onClick={() =>
                                        setIsRunning(
                                            (current) =>
                                                !current
                                        )
                                    }
                                    disabled={
                                        isSaving
                                    }
                                >

                                    {isRunning ? (

                                        <>
                                            <Pause
                                                size={15}
                                            />

                                            Pause
                                        </>

                                    ) : (

                                        <>
                                            <Play
                                                size={15}
                                            />

                                            Resume
                                        </>

                                    )}

                                </button>

                                <button
                                    className="end-session-button"
                                    onClick={
                                        handleEndSession
                                    }
                                    disabled={
                                        isSaving
                                    }
                                >

                                    <Square
                                        size={14}
                                    />

                                    {isSaving
                                        ? "Saving..."
                                        : "End Session"}

                                </button>

                            </>

                        )

                    ) : (

                        <button
                            className="restart-button"
                            onClick={
                                handleRestart
                            }
                        >

                            <RotateCcw
                                size={15}
                            />

                            Restart Demo

                        </button>

                    )}

                </div>

            </div>

        </div>
    );
}

export default LiveSession;