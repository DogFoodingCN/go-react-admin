import type { CSSProperties, ReactNode } from 'react'
import { Typography } from 'antd'
import { rem } from '@/shared/style/rem'

/** Figma 导出的品牌标志（登录 Brand/LogoMark） */
export const BRAND_LOGO_SRC = '/brand/logo-mark.svg'

const brandPanelStyle: CSSProperties = {
  position: 'relative',
  minWidth: 0,
  height: '100%',
  padding: `${rem(64)} ${rem(56)} ${rem(40)}`,
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
  padding: `${rem(40)} ${rem(32)}`,
  background: '#f0f5ff',
  boxSizing: 'border-box',
  overflow: 'auto',
}

type AuthBrandLayoutProps = {
  children: ReactNode
  /** 右侧卡片最大宽度（设计稿 px，内部转 rem） */
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
        <div style={{ marginTop: rem(56), maxWidth: rem(420) }}>
          <div
            style={{
              width: rem(72),
              height: rem(6),
              borderRadius: rem(3),
              background: 'rgba(255,255,255,0.85)',
              marginBottom: rem(28),
            }}
          />
          <Typography.Title
            level={1}
            style={{
              color: '#fff',
              fontSize: rem(44),
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
              fontSize: rem(17),
              marginTop: rem(24),
              marginBottom: 0,
              lineHeight: 1.6,
            }}
          >
            统一初始化、租户治理与应用开通，
            <br />
            让平台交付更清晰、更可控。
          </Typography.Paragraph>
        </div>
        <div style={{ marginTop: 'auto', paddingTop: rem(48) }}>
          <div
            style={{
              display: 'flex',
              gap: rem(20),
              marginBottom: rem(12),
              flexWrap: 'wrap',
            }}
          >
            {['安全可靠', '可审计', '可扩展'].map((label) => (
              <Typography.Text
                key={label}
                style={{ color: 'rgba(255,255,255,0.9)', fontSize: rem(14) }}
              >
                {label}
              </Typography.Text>
            ))}
          </div>
          <Typography.Text style={{ color: 'rgba(255,255,255,0.55)', fontSize: rem(13) }}>
            {footerNote}
          </Typography.Text>
        </div>
        <div
          aria-hidden
          style={{
            position: 'absolute',
            right: rem(-40),
            bottom: rem(-40),
            width: rem(220),
            height: rem(220),
            borderRadius: rem(24),
            background: 'rgba(255,255,255,0.08)',
            transform: 'rotate(18deg)',
          }}
        />
      </aside>
      <main style={cardPanelStyle}>
        <div style={{ width: '100%', maxWidth: rem(cardMaxWidth) }}>{children}</div>
      </main>
    </div>
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
