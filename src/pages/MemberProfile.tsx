import { useMemo } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import {
  SITE_URL,
  getMemberBySlug,
  memberPath,
  memberProfiles,
  memberSlug,
  memberUrl,
} from '../data/members';
import { usePageSeo } from '../lib/seo';
import './MemberProfile.css';

const MemberProfile = () => {
  const { memberSlug: slug } = useParams<{ memberSlug: string }>();
  const member = slug ? getMemberBySlug(slug) : undefined;

  if (!member) {
    return <MemberNotFound />;
  }

  const canonicalSlug = memberSlug(member.name);
  if (slug !== canonicalSlug) {
    return <Navigate to={`/${canonicalSlug}`} replace />;
  }

  return <MemberProfileContent member={member} />;
};

const MemberNotFound = () => {
  usePageSeo({
    title: 'Member Not Found | Columbia Commodity Club',
    description: 'This member profile could not be found on the Columbia Commodity Club website.',
    canonicalUrl: `${SITE_URL}/`,
  });

  return (
    <div className="member-profile-page">
      <div className="container">
        <div className="member-not-found">
          <h1>Member Not Found</h1>
          <p>We could not find a member profile at this address.</p>
          <Link to="/" className="btn btn-primary">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

const MemberProfileContent = ({ member }: { member: NonNullable<ReturnType<typeof getMemberBySlug>> }) => {
  const otherMembers = memberProfiles.filter((profile) => profile.name !== member.name);
  const canonicalUrl = memberUrl(member);
  const imageUrl = `${SITE_URL}${member.image}`;
  const jsonLd = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: member.name,
      url: canonicalUrl,
      image: imageUrl,
      description: member.bio,
      jobTitle: 'Member',
      worksFor: {
        '@type': 'Organization',
        name: 'Columbia Commodity Club',
        url: SITE_URL,
      },
    }),
    [member.name, member.bio, canonicalUrl, imageUrl]
  );

  usePageSeo({
    title: `${member.name} | Columbia Commodity Club`,
    description: member.bio,
    canonicalUrl,
    image: imageUrl,
    type: 'profile',
    jsonLd,
  });

  return (
    <div className="member-profile-page">
      <div className="container">
        <Link to="/" className="member-back-link">
          ← Back to Home
        </Link>

        <article className="member-profile">
          <div className="member-profile-media">
            <img
              src={member.image}
              alt={member.name}
              className="member-profile-image"
              style={member.imagePosition ? { objectPosition: member.imagePosition } : undefined}
            />
          </div>
          <div className="member-profile-body">
            <p className="member-profile-eyebrow">Columbia Commodity Club</p>
            <h1 className="member-profile-name">{member.name}</h1>
            <p className="member-profile-role">Member</p>
            <p className="member-profile-bio">{member.bio}</p>
          </div>
        </article>

        {otherMembers.length > 0 && (
          <section className="member-profile-others" aria-labelledby="other-members-heading">
            <h2 id="other-members-heading" className="member-profile-others-title">
              Other Members
            </h2>
            <div className="member-profile-others-grid">
              {otherMembers.map((profile) => (
                <Link
                  key={profile.name}
                  to={memberPath(profile)}
                  className="member-profile-other-card"
                >
                  <img
                    src={profile.image}
                    alt={profile.name}
                    className="member-profile-other-image"
                    style={profile.imagePosition ? { objectPosition: profile.imagePosition } : undefined}
                  />
                  <h3 className="member-profile-other-name">{profile.name}</h3>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default MemberProfile;
