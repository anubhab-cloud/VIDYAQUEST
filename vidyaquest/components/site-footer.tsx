"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BrandLogo } from "@/components/brand-logo"
import { STUDENT_LANGUAGES, type StudentTab } from "@/lib/student-data"
import styles from "./site-footer.module.css"

const learningLinks = [
  ["overview", "Overview", "/#home"],
  ["world", "Virtual World", "/#world"],
  ["labs", "Virtual Labs", "/#labs"],
  ["ai-guide", "AI Quest Guide", "/#companion"],
  ["reports", "Skill Passport", "/#competitions"],
] as const

export function StudentBrand({
  className = "student-brand",
  markClassName = "student-brand-mark",
}: {
  className?: string
  markClassName?: string
}) {
  return (
    <Link href="/" className={className} aria-label="VidyaQuest home">
      <BrandLogo className={markClassName} />
      <span translate="no">
        vidya<span>quest</span>
      </span>
    </Link>
  )
}

type StudentFooterControls = {
  language: string
  onLanguageChange: (language: string) => void
  onNavigate: (tab: StudentTab) => void
}

export function DefaultSiteFooter({ year }: { year: string }) {
  const pathname = usePathname()
  if (pathname === "/student" || pathname === "/student/") return null
  return <SiteFooter year={year} />
}

export function SiteFooter({
  year,
  student,
}: {
  year: string
  student?: StudentFooterControls
}) {
  return (
    <footer className={styles.footer} data-student={student ? "" : undefined}>
      <svg
        className={styles.skyline}
        viewBox="0 0 1200 140"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d="M0 140V90h60v50h10V50h50v90h10V75h70v65h10V20h55v120h10V65h60v75h10V95h45v45h10V40h65v100h10V80h50v60h10V10h60v130h10V60h70v80h10V85h45v55h10V30h55v110h10V70h65v70h10V45h50v95h10V90h60v50h10V25h55v115h10V70h60v70h10V55h55v85Z" />
      </svg>
      <div className={styles.inner}>
        <div className={styles.columns}>
          <div>
            <StudentBrand
              className={styles.brand}
              markClassName={styles.mark}
            />
            <p>
              Learn, play, explore, and achieve with virtual labs, quests, and
              learning tools.
            </p>
          </div>
          <nav aria-label="Learn">
            <h2>Learn</h2>
            <ul>
              {learningLinks.map(([tab, label, href]) => (
                <li key={tab}>
                  {student ? (
                    <button
                      type="button"
                      className={styles.textButton}
                      onClick={() => student.onNavigate(tab)}
                    >
                      {label}
                    </button>
                  ) : (
                    <Link href={href}>{label}</Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Support">
            <h2>Support</h2>
            <ul>
              <li>
                <Link href="/#schools">For teachers</Link>
              </li>
              <li>
                <Link href="/#parents">For parents</Link>
              </li>
              <li>
                <Link href="/#inclusion">Inclusive learning</Link>
              </li>
            </ul>
          </nav>
          <div>
            <h2 id="footer-language">Learning language</h2>
            <div
              className={styles.languages}
              role="group"
              aria-labelledby="footer-language"
            >
              {STUDENT_LANGUAGES.map(({ value, label, locale }) =>
                student ? (
                  <button
                    key={value}
                    type="button"
                    lang={locale}
                    aria-pressed={student.language === value}
                    onClick={() => student.onLanguageChange(value)}
                  >
                    {label}
                  </button>
                ) : (
                  <span key={value} lang={locale}>
                    {label}
                  </span>
                )
              )}
            </div>
            {student ? (
              <button
                type="button"
                className={styles.action}
                onClick={() => student.onNavigate("settings")}
              >
                Open settings
              </button>
            ) : (
              <Link className={styles.action} href="/#inclusion">
                Language support
              </Link>
            )}
          </div>
        </div>
        <div className={styles.base}>
          <span>
            © {year} VidyaQuest. Made with{" "}
            <span aria-label="love" role="img">
              ♥
            </span>{" "}
            in India.
          </span>
          <nav aria-label="Footer">
            <Link href="/#about">About VidyaQuest</Link>
            <a href="#top">Back to top ↑</a>
          </nav>
        </div>
      </div>
    </footer>
  )
}
