import type { CSSProperties, ReactNode } from 'react'
import { Typography } from 'antd'

/** Figma 导出的品牌标志（登录 Brand/LogoMark） */
export const BRAND_LOGO_SRC = '/brand/logo-mark.svg'

const brandPanelStyle: CSSProperties = {
  position: 'relative',
  minWidth: 0,
  height: '100%',
  padding: '64px 56px 40px',
  color: '#fff',
  background: 'linear-gradient(160deg, #0b1f4d 0%, #123a8c 42%, #1677ff 100%)',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  boxSizing: 'border-box',
}

const cardPanelStyle: CSSProperties = {
  minWidth: 0,
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '40px 32px',
  background: '#f0f5ff',
  boxSizing: 'border-box',
  overflow: 'auto',
}

type AuthBrandLayoutProps = {
  children: ReactNode
  /** 右侧卡片最大宽度 */
  cardMaxWidth?: number
  footerNote?: string
}

/**
 * 登录 / Setup 左右分栏壳（对齐 Figma）。
 * 使用固定两列 Grid，避免 flex-wrap 把右侧挤到下一行变成「上下结构」。
 */
export function AuthBrandLayout({
  children,
  cardMaxWidth = 480,
  footerNote = '仅支持账号密码登录',
}: AuthBrandLayoutProps) {
  return (
    <div
      style={{
        height: '100%',
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 0.92fr) minmax(0, 1.08fr)',
        gridTemplateRows: 'minmax(100vh, 1fr)',
        background: '#f0f5ff',
      }}
    >
      <aside style={brandPanelStyle}>
        <BrandLockup light height={40} />
        <div style={{ marginTop: 56, maxWidth: 420 }}>
          <div
            style={{
              width: 72,
              height: 6,
              borderRadius: 3,
              background: 'rgba(255,255,255,0.85)',
              marginBottom: 28,
            }}
          />
          <Typography.Title
            level={1}
            style={{
              color: '#fff',
              fontSize: 44,
              lineHeight: 1.2,
              margin: 0,
              fontWeight: 600,
            }}
          >
            多租户 · 多应用
            <br />
            管理控制台
          </Typography.Title>
          <Typography.Paragraph
            style={{
              color: 'rgba(255,255,255,0.88)',
              fontSize: 17,
              marginTop: 24,
              marginBottom: 0,
              lineHeight: 1.6,
            }}
          >
            统一初始化、租户治理与应用开通，
            <br />
            让平台交付更清晰、更可控。
          </Typography.Paragraph>
        </div>
        <div style={{ marginTop: 'auto', paddingTop: 48 }}>
          <div style={{ display: 'flex', gap: 20, marginBottom: 12, flexWrap: 'wrap' }}>
            {['安全可靠', '可审计', '可扩展'].map((label) => (
              <Typography.Text
                key={label}
                style={{ color: 'rgba(255,255,255,0.9)', fontSize: 14 }}
              >
                {label}
              </Typography.Text>
            ))}
          </div>
          <Typography.Text style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13 }}>
            {footerNote}
          </Typography.Text>
        </div>
        <div
          aria-hidden
          style={{
            position: 'absolute',
            right: -40,
            bottom: -40,
            width: 220,
            height: 220,
            borderRadius: 24,
            background: 'rgba(255,255,255,0.08)',
            transform: 'rotate(18deg)',
          }}
        />
      </aside>
      <main style={cardPanelStyle}>
        <div style={{ width: '100%', maxWidth: cardMaxWidth }}>{children}</div>
      </main>
    </div>
  )
}

type BrandLockupProps = {
  light?: boolean
  style?: CSSProperties
  /** logo 高度，默认 36 */
  height?: number
}

export function BrandLockup({ light = false, style, height = 36 }: BrandLockupProps) {
  const width = Math.round((height * 48) / 40)
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 12,
        ...style,
      }}
    >
      <img
        src={BRAND_LOGO_SRC}
        alt="Go-React-Admin"
        width={width}
        height={height}
        style={{ display: 'block', objectFit: 'contain' }}
      />
      <Typography.Text
        strong
        style={{
          fontSize: Math.max(16, Math.round(height * 0.55)),
          color: light ? '#fff' : '#06164f',
          letterSpacing: 0.2,
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
        padding: '48px 24px 40px',
        overflow: 'auto',
      }}
    >
      <BrandLockup height={40} />
      <div style={{ width: '100%', maxWidth: 920, marginTop: 28 }}>{children}</div>
    </div>
  )
}
