---
title: Chaupad
description: An ancient Indian boardgame - Chaupad, adapted for modern day.
palette:
  primary: "#972E34"
  secondary: "#E1CCB4"
---

<style>
  .layout--container--double {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--m1);
  }
  @media (max-width: 714px) {
    .layout--container--double {
      grid-template-columns: 1fr;
    }
  }

  .content--detail {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: var(--m0);
  }
  .content--detail > * {
    display: grid;
    gap: 0.33em;
  }
  .content--detail a {
    text-decoration: none;
  }
  .content--detail a:not(:last-of-type)::after {
    content: ', ';
  }
  .content--info {
    display: grid;
    align-items: start;
    grid-template-columns: 1fr 1fr;
    grid-gap: var(--m1);
  }
  @media (max-width: 714px) {
    .content--detail {
      grid-template-columns: 1fr;
    }
  }
</style>

<main>

  <section class="layout--container--grid layout--bleeding layout--lining--thick layout--leading--thick">
    <div class="layout--container--double">
      <img src="/media/galleries/collections/chaupad/Chaupad-Design-Syahi-Begar.jpg" alt="">
      <div class="layout--container--grid">
        <h2>Chaupad Game</h2>

        <p>Chaupad is an ancient Indian game and precursor to our modern favourites like Ludo. While this game is no longer central to village life, today, elders might still be spotted tossing cowrie shells into the air. It is with their help we could re-discover this intriguing game of strategy and share it with you.</p>

        <section>
          <div class="content--detail">
            <div>
              <div class="token--featured">
                61×61cm
              </div>
              <div class="token--label--small">
                Size
              </div>
            </div>
            <div>
              <div class="token--featured">
                Cotton
              </div>
              <div class="token--label--small">
                Material
              </div>
            </div>
            <div style="grid-column: 1 / -1;">
              <div class="token--featured">
                Hand Block Printed, Natural dye, Printed lining
              </div>
              <div class="token--label--small">
                Features
              </div>
            </div>
            <div style="grid-column: 1 / -1;">
              <div class="token--featured"> 
                Cowrie shells, Chaupad rules, Wooden Tokens, Printed bag
              </div>
              <div class="token--label--small">
                Play Set
              </div>
            </div>
          </div>
        </section>

        <hr style="opacity: 10%;">

        <section class="collection--pricing--logged-in utility--hide layout--container--grid layout--leading--thin" style="color: var(--palette--primary);">
          <div class="content--detail">
            <div>
              <div class="token--featured">
                3950 INR
              </div>
              <div class="token--label--small">
                Price
              </div>
            </div>
          </div>
          <ui--button tier="primary" featured stretch link href="/contact?topic=collections&amp;collection=jajam-chaupad#form" target="_blank">
            Buy
          </ui--button>
          <p class="token--caption">
            Free shipping in India. Amount includes all taxes.
          </p>
        </section>

        <section class="collection--pricing--logged-out layout--container--grid layout--leading--thin" style="color: var(--palette--primary);" style="display: none;">
          <ui--button tier="primary" featured stretch link href="/account" target="_blank">
            Log In for Quote
          </ui--button>
          <p class="token--caption">
            Free shipping in India. Amount includes all taxes.
          </p>
        </section>
      </div>
    </div>

    <embed--gallery
      href="#"
      class="utility--no-fouc"
      style="--embed--gallery--min-width-medium: 12em; --embed--gallery--min-width-medium: 14em;"
    >
      <img
        loading="eager"
        decoding="async"
        fetchpriority="high"
        src="/media/galleries/collections/chaupad/Board-game-Jajam-Collection-Wabisabi-Project.jpg"
        alt=""
      />
      <img
        loading="eager"
        decoding="async"
        fetchpriority="high"
        src="/media/galleries/collections/chaupad/Chaupad-board-game-hand-block-printed.jpg"
        alt=""
      />
    </embed--gallery>
  </section>

  <section 
    class="layout--container--grid layout--bleeding layout--lining--thick layout--leading--thick"
    style="background: var(--palette--neutral-1--paper); color: var(--palette--neutral--ink);"
  >
    <ui--separator custom="">
      <h1 class="token--label--small">Add-ons</h1>
    </ui--separator>
    
    <div class="layout--container--double">
      <img src="/media/galleries/collections/chaupad/gift-box-chaupad-800x600.jpg" alt="">

      <div class="layout--container--grid">
        <h3>Gift Box</h3>
        <p>Gift this jajam in this box made with handmade paper and printed in Jajam motifs.</p>

        <section class="collection--pricing--logged-in utility--hide layout--container--grid layout--leading--thin" style="color: var(--palette--primary);">
          <div class="content--detail">
            <div>
              <div class="token--featured">
                125 INR
              </div>
              <div class="token--label--small">
                Price
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </section>

  <script>
    document.addEventListener('readystatechange', (event) => {
      if (document.readyState !== 'complete') return
      if (document.querySelector('site--header').user_profile) {
        document.querySelectorAll('.collection--pricing--logged-out').forEach((element) => element.classList.add('utility--hide'))
        document.querySelectorAll('.collection--pricing--logged-in').forEach((element) => element.classList.remove('utility--hide'))
      }
    })
  </script>
</main>
