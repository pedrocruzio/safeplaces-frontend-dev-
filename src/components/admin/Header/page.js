import React from 'react'
import {
  BannerNavigation,
  BannerNavigationItem,
  Link
} from '@wfp/ui';
import './style.scss';

const Page = () => {
  return (
    <BannerNavigation className="header">
      <BannerNavigationItem className="logo">
        <a href="#" />
      </BannerNavigationItem>
      <BannerNavigationItem>
        <Link>
          Contact Trace
        </Link>
      </BannerNavigationItem>
      <BannerNavigationItem>
        <Link href="#">
          Publish Data
        </Link>
      </BannerNavigationItem>
      <BannerNavigationItem>
        <Link href="#">
          Settings
        </Link>
      </BannerNavigationItem>
    </BannerNavigation>
  );
}

export default Page;