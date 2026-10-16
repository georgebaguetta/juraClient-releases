// Points the main button at the build for the visitor's system and highlights its card.

const detect = async () => {
  const ua = navigator.userAgentData;
  const platform = (ua?.platform ?? navigator.platform ?? '').toLowerCase();

  if (platform.includes('mac')) return { os: 'mac' };
  if (!platform.includes('win')) return null;

  const { architecture } = (await ua?.getHighEntropyValues(['architecture']).catch(() => null)) ?? {};
  return { os: 'win', arch: architecture === 'arm' ? 'arm64' : 'x64' };
};

const system = await detect();

if (system) {
  const card = document.querySelector(`.card[data-os="${system.os}"]`);
  const link = system.os === 'mac' ? card.querySelector('a') : card.querySelector(`a[data-arch="${system.arch}"]`);
  const primary = document.querySelector('#primary-download');

  card.classList.add('current');
  for (const button of card.querySelectorAll('.btn')) {
    button.classList.toggle('primary', button === link);
    button.classList.toggle('ghost', button !== link);
  }
  primary.href = link.href;
  primary.textContent = system.os === 'mac' ? 'Download for Mac' : 'Download for Windows';
  document.querySelector('#primary-note').textContent = system.os === 'mac'
    ? 'macOS 14 or later · Apple Silicon'
    : `Windows 10/11 · ${system.arch === 'arm64' ? 'ARM64' : 'x64'} · other versions below`;
}
