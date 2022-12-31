class Poll {
  constructor(root, title) {
    this.root = root;
    this.seleted = sessionStorage.getItem("poll-selected");
    this.endpoint = "http://localhost:7240/poll";
    this.totalVotes = 0;

    // Inject HTML CODE
    this.root.insertAdjacentHTML(
      "afterbegin",
      `
    <div class="poll__title">${title}</div>`
    );

    // API CALL
    this._refresh();
  }

  async _refresh() {
    const response = await fetch(this.endpoint);
    const data = await response.json();
    this.totalVotes = data.totalVotes;

    this.root
      .querySelectorAll(".poll__option")
      .forEach((option) => option.remove());

    for (const option of data.cdata) {
      const template = document.createElement("template");
      const fragment = template.content;

      template.innerHTML = `
        <div class="poll__option ${
          this.seleted == option.label ? "poll__option--selected" : ""
        }">
        <div class="poll__option-fill"></div>
        <div class="poll__option-info">
          <span class="poll__label">${option.label}</span>
          <span class="poll__percentate">${option.percentage}%</span>
        </div>
      </div>
        `;
      console.log(data.totalVotes);
      fragment.querySelector(
        ".poll__option-fill"
      ).style.width = `${option.percentage}%`;

      if (!this.selected) {
        fragment
          .querySelector(".poll__option")
          .addEventListener("click", () => {
            fetch(this.endpoint, {
              method: "post",
              body: `add=${option.label}`,
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
            }).then(() => {
              this.seleted = option.label;
              sessionStorage.setItem("poll-selected", option.label);
              this._refresh();
            });
          });
      }

      //append fragment to DOM
      const total = document.querySelector(".poll__totalvotes");
      total.innerHTML = `Total Votes: ${this.totalVotes}`;
      this.root.appendChild(fragment);
    }
  }
}

const p = new Poll(document.querySelector(".poll"), "Which do you prefer? ");
