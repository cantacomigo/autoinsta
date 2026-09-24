import { InstagramAccount, ProxyConfig, TargetingConfig, AutomationConfig, ActivityLog, GrowthDataPoint } from '../types';

export const initialAccounts: InstagramAccount[] = [];

export const initialProxies: ProxyConfig[] = [];

export const defaultTargeting: TargetingConfig = {
  hashtags: [],
  competitorAccounts: [],
  locations: [],
  exploreFeed: false,
  postCommenters: [],
  filters: {
    minFollowers: 0,
    maxFollowers: 50000,
    hasProfilePic: true,
    hasBio: false,
    minPosts: 0,
    accountType: 'all',
    skipPrivate: false,
  }
};

export const defaultAutomation: AutomationConfig = {
  likePosts: true,
  likesPerProfile: 2,
  commentPosts: false,
  commentsSpintax: [],
  followUsers: true,
  unfollowUsers: true,
  unfollowAfterDays: 3,
  unfollowOnlyNonFollowers: true,
  whitelist: [],
  viewStories: true,
  likeStories: true,
  reactPolls: false,
  welcomeDmEnabled: false,
  welcomeDmMessage: '',
  keywordTriggers: []
};

export const initialLogs: ActivityLog[] = [];

export const growthHistory: GrowthDataPoint[] = [];
