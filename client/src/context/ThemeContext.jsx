import { createContext, useContext, useEffect, useState, useCallback } from "react"
import { flushSync } from "react-dom"

const ThemeContext = createContext(null)

const THEME_KEY = "snapurl-theme"

function getStoredTheme() {
    const stored = localStorage.getItem(THEME_KEY)
    if (stored === "light" || stored === "dark") return stored
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark"
}

function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme)
    document.documentElement.style.colorScheme = theme
    localStorage.setItem(THEME_KEY, theme)
}

applyTheme(getStoredTheme())

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(getStoredTheme)

    useEffect(() => {
        document.documentElement.classList.add("theme-transition")
        applyTheme(theme)
        const t = setTimeout(() => document.documentElement.classList.remove("theme-transition"), 450)
        return () => clearTimeout(t)
    }, [theme])

    const toggleTheme = useCallback((e) => {
        const nextTheme = theme === "dark" ? "light" : "dark"
        if (document.startViewTransition) {
            const x = e?.clientX ?? window.innerWidth / 2
            const y = e?.clientY ?? window.innerHeight / 2
            const endRadius = Math.hypot(
                Math.max(x, window.innerWidth - x),
                Math.max(y, window.innerHeight - y)
            )

            const transition = document.startViewTransition(() => {
                flushSync(() => {
                    setTheme(nextTheme)
                })
            })

            transition.ready.then(() => {
                const clipPath = [
                    `circle(0px at ${x}px ${y}px)`,
                    `circle(${endRadius}px at ${x}px ${y}px)`,
                ]
                document.documentElement.animate(
                    {
                        clipPath: clipPath,
                    },
                    {
                        duration: 450,
                        easing: "cubic-bezier(0.4, 0, 0.2, 1)",
                        pseudoElement: "::view-transition-new(root)",
                    }
                )
            })
        } else {
            setTheme(nextTheme)
        }
    }, [theme])

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, isDark: theme === "dark" }}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    const ctx = useContext(ThemeContext)
    if (!ctx) throw new Error("useTheme must be used within ThemeProvider")
    return ctx
}
