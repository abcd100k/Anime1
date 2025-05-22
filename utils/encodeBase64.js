import { useRouter } from 'next/router';

const encodeBase64 = (link, sz, ldn) => {
  const router = useRouter();
  if (!link || !sz || !ldn) {
    alert("Please fill in all fields.");
    return;
  }

  const encodedHtmlInput = btoa(link);
  const encodedSz = btoa(sz);
  const encodedLdn = btoa(ldn);

  const baseUrl = "/appDown";
  const fullUrl = `${baseUrl}?dl=${encodedHtmlInput}&dn=${encodedLdn}&ds=${encodedSz}`;

  router.push(fullUrl);
};

export default encodeBase64;