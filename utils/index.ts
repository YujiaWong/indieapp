export const getUrlParams = () => {
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);
  return params;
};

export const getCurrUserAvatarUrl = (userInfo: any) => {
  return userInfo?.avatarUrl || 'https://i.pravatar.cc/150?u=a042581f4e29026024d';
}
