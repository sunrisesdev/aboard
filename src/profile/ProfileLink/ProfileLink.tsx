import {
  IconArrowUpRight,
  IconBrandGithub,
  IconBrandInstagram,
  IconBrandMastodon,
  IconLink,
  IconWorldWww,
} from '@tabler/icons-react';
import type { UserProfile } from '@/lib/traewelling';
import styles from './ProfileLink.module.css';

type ProfileLinkType = UserProfile['profileLinks'][number]['name'];

function formatMastodonHandle(mastodonUrl: string) {
  const url = URL.parse(mastodonUrl);
  const handle = url?.pathname.split('/').find((segment) => segment.startsWith('@'));

  return url && handle ? `${handle}@${url.hostname}` : mastodonUrl;
}

function getGenericHandle(href: string, domain: string) {
  const [_, path] = href.split(domain.endsWith('/') ? domain : `${domain}/`);
  const [handle] = path.split('?');
  return handle;
}

function getLinkContent(type: ProfileLinkType, href: string) {
  switch (type) {
    case 'github':
      return (
        <>
          <IconBrandGithub aria-hidden data-via-icon />
          <strong>GitHub</strong>
          <span>{getGenericHandle(href, 'github.com')}</span>
        </>
      );
    case 'instagram':
      return (
        <>
          <IconBrandInstagram aria-hidden data-via-icon />
          <strong>Instagram</strong>
          <span>{getGenericHandle(href, 'instagram.com')}</span>
        </>
      );
    case 'mastodon':
      return (
        <>
          <IconBrandMastodon aria-hidden data-via-icon />
          <strong>Mastodon</strong>
          <span>{formatMastodonHandle(href)}</span>
        </>
      );
    case 'website':
      return (
        <>
          <IconWorldWww aria-hidden data-via-icon />
          <span>{href}</span>
        </>
      );
    default:
      return (
        <>
          <IconLink aria-hidden data-via-icon />
          <strong>{type}</strong>
          <span>{href}</span>
        </>
      );
  }
}

function getLinkTitle(type: ProfileLinkType) {
  if (['github', 'instagram', 'mastodon'].includes(type)) return;

  return `${type.at(0)?.toUpperCase()}${type.substring(1)}`;
}

export const ProfileLink = ({ type, url }: { type: ProfileLinkType; url: string }) => {
  return (
    <a className={styles.base} href={url} rel="noopener noreferrer" target="_blank" title={getLinkTitle(type)}>
      {getLinkContent(type, url)}

      <IconArrowUpRight className={styles.arrow} data-via-icon />
    </a>
  );
};
