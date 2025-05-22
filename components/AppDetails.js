import Head from "next/head";
import encodeBase64 from "../utils/encodeBase64";

const AppDetails = ({ app }) => {
  if (!app) return <div>App not found.</div>;

  const handleEncode = () => {
    encodeBase64(app.downloadUrl, 'N/A', app.name, window.location);
  };

  return (
    <>
      <Head>
        <title>{app.name} {app.season}</title>
        <meta name="description" content={`${app.name} - ${app.subtitle}. Watch ${app.name} episode ${app.episode} in ${app.language} now!`} />
        <meta name="keywords" content={`${app.name}, ${app.season}, ${app.language}, anime, download`} />
        <meta property="og:title" content={`${app.name} ${app.season}`} />
        <meta property="og:description" content={`${app.name} - ${app.subtitle}. Episode ${app.episode}`} />
        <meta property="og:image" content={app.iconUrl} />
        <meta property="og:url" content={typeof window !== 'undefined' ? window.location.href : ''} />
      </Head>

      <section className="apk-details">
        <h2>{app.name} {app.season}</h2>
        <p>{app.subtitle}</p>
        <div className="img_dow"><img src={app.iconUrl} alt={app.name} /></div>

        <div className="info">
          <p><strong>Updated:</strong> {app.updatedDate}</p>
          <p><strong>Season:</strong> {app.season}</p>
          <p><strong>Episode:</strong> {app.episode}</p>
          <p><strong>Language:</strong> {app.language}</p>
        </div>
      </section>

      <section className="screenshots">
        <h3>Screenshots</h3>
        <div className="screenshot-gallery">
          {app.screenshots?.map((screenshot, index) => (
            <img key={index} src={screenshot} alt={`Screenshot ${index + 1}`} />
          ))}
        </div>
      </section>

      <section className="description">
        <h3>Description</h3>
        <p dangerouslySetInnerHTML={{ __html: app.description }} />
      </section>

      <div className="right_download_area">
        <div className="download_box_area badge">
          <div className="first_box_area">
            <p>Movie Information &amp; Free Download</p>
          </div>
          <div className="secand_box_area">
            <div
              className="badge"
              style={{ background: "#f6008b", padding: 10, marginBottom: 8 }}
              onClick={() => typeof window !== 'undefined' && window.open(app.watchUrl, "_blank")}
            >
              Online Watch
            </div>
            <div
              className="badge"
              style={{ background: "#f6008b", padding: 10 }}
            >
              <a onClick={handleEncode}>Download</a>
            </div>

            <div style={{ height: 20 }}></div>
          </div>
          <a
            className="badge"
            style={{ marginTop: 40, background: "#0c00ff", padding: 10, textAlign: "center" }}
            href="/Download/how-to-download.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            How to Download or Watch
          </a>
        </div>
      </div>

      <div className="share_btn">
        <i className="fi fi-rr-share" style={{ fontSize: 15, display: "flex", margin: 6 }} />
        <ul className="share-a social color">
          <li className="facebook has-span">
            <a
              className="bi-facebook btn pbt-wo"
              href={`https://www.facebook.com/sharer.php?u=${typeof window !== 'undefined' ? window.location.href : ''}`}
              rel="nofollow noopener"
              title="Facebook"
              id="facebook"
            >
              <span>
                <img src="https://nxprime.in/assets/images/facebook.AVIF" alt="facebook" loading="lazy" />
                Facebook
              </span>
            </a>
          </li>
          <li className="twitter has-span">
            <a
              className="bi-twitter btn pbt-wo"
              href={`https://twitter.com/intent/tweet?url=${typeof window !== 'undefined' ? window.location.href : ''}`}
              rel="nofollow noopener"
              title="Twitter"
              id="twitter"
            >
              <span>
                <img src="https://nxprime.in/assets/images/twitter.AVIF" alt="twitter" loading="lazy" />
                Twitter
              </span>
            </a>
          </li>
          <li className="whatsapp">
            <a
              className="bi-whatsapp btn pbt-wo"
              href={`https://api.whatsapp.com/send?text=${typeof window !== 'undefined' ? window.location.href : ''}`}
              rel="nofollow noopener"
              title="WhatsApp"
              id="whatsApp"
            >
              <span>
                <img src="https://nxprime.in/assets/images/whatsapp.AVIF" alt="whatsapp" loading="lazy" className="m_0" />
                <span className="hid_mob">Whatsapp</span>
              </span>
            </a>
          </li>
          <li className="email">
            <a
              className="bi-email btn pbt-wo"
              id="email"
              href={`mailto:codmark14@gmail.com?subject=${app.subtitle} &body=${typeof window !== 'undefined' ? window.location.href : ''}`}
              rel="nofollow noopener"
              title="Email"
            >
              <span>
                <img src="https://nxprime.in/assets/images/email.AVIF" alt="email" className="m_0" />
                <span className="hid_mob">Email</span>
              </span>
            </a>
          </li>
        </ul>
      </div>

      <div className="pop_telegram" id="tele_gr">
        <a href="https://t.me/mximexyz" target="_blank" rel="noopener noreferrer">
          <i className="fi fi-brands-telegram" />
          <p>Join Us On Telegram</p>
        </a>
        <div
          className="close_btn_tel"
          onClick={() => typeof document !== 'undefined' && document.getElementById('tele_gr')?.classList.add('hide_tele')}
        >
          X
        </div>
      </div>
    </>
  );
};

export default AppDetails;
