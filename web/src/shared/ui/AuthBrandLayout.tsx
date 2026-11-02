import type { CSSProperties, ReactNode } from 'react'
import { Typography } from 'antd'
import { rem } from '@/shared/style/rem'

/** Figma 导出的品牌标志（登录 Brand/LogoMark） */
export const BRAND_LOGO_SRC = '/brand/logo-mark.svg'

type AuthEntryShellProps = {
  children: ReactNode
  /** 底部特性区副文案 */
  featuresNote?: ReactNode
}

/**
 * 登录 / Setup 入口共用壳（对齐 Figma setup-entry）。
 * 左侧背景、品牌文案、特性条固定；右侧卡片内容由 children 注入。
 */
export function AuthEntryShell({
  children,
  featuresNote = (
    <>
      Powered by{' '}
      <a href="https://dogfooding.cn" target="_blank" rel="noreferrer">
        dogfooding.cn
      </a>
    </>
  ),
}: AuthEntryShellProps) {
  return (
    <div className="setup-entry">
      <img
        aria-hidden
        className="setup-entry__background"
        src="/brand/setup-entry/background.svg"
      />
      <img
        aria-hidden
        className="setup-entry__geometry"
        src="/brand/setup-entry/decorative-geometry.svg"
      />

      <div className="setup-entry__brand-block">
        <div className="setup-entry__lockup">
          <img src={BRAND_LOGO_SRC} alt="" />
          <span>Go-React-Admin</span>
        </div>

        <section className="setup-entry__brand-copy">
          <img
            aria-hidden
            className="setup-entry__accent"
            src="/brand/setup-entry/accent-line.svg"
          />
          <h1>
            多租户 · 多应用
            <br />
            管理控制台
          </h1>
          <p>
            统一初始化、租户治理与应用开通，
            <br />
            让平台交付更清晰、更可控。
          </p>
        </section>
      </div>

      <section className="setup-entry__features">
        <div className="setup-entry__feature">
          <span className="setup-entry__feature-icon setup-entry__feature-icon--secure">
            <img src="/brand/setup-entry/icon-secure.svg" alt="" />
            <img src="/brand/setup-entry/icon-secure-check.svg" alt="" />
          </span>
          <span>安全可靠</span>
        </div>
        <img
          className="setup-entry__feature-divider"
          src="/brand/setup-entry/divider.svg"
          alt=""
        />
        <div className="setup-entry__feature">
          <span className="setup-entry__feature-icon setup-entry__feature-icon--audit">
            <img src="/brand/setup-entry/icon-audit.svg" alt="" />
            <img src="/brand/setup-entry/icon-audit-inner.svg" alt="" />
          </span>
          <span>可审计</span>
        </div>
        <img
          className="setup-entry__feature-divider"
          src="/brand/setup-entry/divider.svg"
          alt=""
        />
        <div className="setup-entry__feature">
          <span className="setup-entry__feature-icon setup-entry__feature-icon--extensible">
            <img src="/brand/setup-entry/icon-extensible.svg" alt="" />
            <img src="/brand/setup-entry/icon-extensible-inner.svg" alt="" />
          </span>
          <span>可扩展</span>
        </div>
        <small>{featuresNote}</small>
      </section>

      {children}
    </div>
  )
}

type AuthEntryCardProps = {
  children: ReactNode
  className?: string
}

/** 右侧入口卡片容器，登录与 Setup 入口共用尺寸与阴影 */
export function AuthEntryCard({ children, className }: AuthEntryCardProps) {
  return (
    <main className={['setup-entry__card', className].filter(Boolean).join(' ')}>
      {children}
    </main>
  )
}

type BrandLockupProps = {
  light?: boolean
  style?: CSSProperties
  /** logo 高度（设计稿 px），默认 36 */
  height?: number
}

export function BrandLockup({ light = false, style, height = 36 }: BrandLockupProps) {
  const width = Math.round((height * 48) / 40)
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: rem(12),
        ...style,
      }}
    >
      <img
        src={BRAND_LOGO_SRC}
        alt="Go-React-Admin"
        style={{
          display: 'block',
          objectFit: 'contain',
          width: rem(width),
          height: rem(height),
        }}
      />
      <Typography.Text
        strong
        style={{
          fontSize: rem(Math.max(16, Math.round(height * 0.55))),
          color: light ? '#fff' : '#06164f',
          letterSpacing: rem(0.2),
        }}
      >
        Go-React-Admin
      </Typography.Text>
    </div>
  )
}

/** 向导步骤页：顶栏 Logo + 居中卡片，纵向铺满视口（对齐 Figma wizard） */
export function SetupWizardShell({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        height: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: '#f0f5ff',
        padding: `${rem(48)} ${rem(24)} ${rem(40)}`,
        overflow: 'auto',
      }}
    >
      <BrandLockup height={40} />
      <div style={{ width: '100%', maxWidth: rem(920), marginTop: rem(28) }}>{children}</div>
    </div>
  )
}
