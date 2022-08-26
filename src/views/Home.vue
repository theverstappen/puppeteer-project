<template>
  <div class="container">
    <template v-if="step === 0">
      <div class="info-text">
        You can choose any category to get your book
      </div>
      <div v-for="genre in genreList" class="element-card" :key="genre" @click="handleClick(genre)">
        <div class="front-facing">
          <h1 class="abr">{{ genre.substring(0, 2) }}</h1>
          <p class="title">{{ genre }}</p>
          <span class="atomic-number">{{ Math.floor(Math.random() * 100) }}</span>
        </div>
      </div>
    </template>
    <stepper v-if="step > 0 && !errorMessage" :step="step" :label="purchaseInfo" />
    <div v-if="errorMessage" class="loading-text">{{ errorMessage }}</div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator"
import Stepper from "@/components/Stepper.vue"
import axios, { AxiosError } from "axios"
import { Book, Purchase, ErrorResponse } from "@/utils/types"

@Component({
  components: {
    Stepper
  }
})
export default class Home extends Vue {
  // Data property
  step = 0
  bookRetry = 0
  purchaseRetry = 0
  purchaseInfo = ""
  errorMessage = ""
  serviceErrorMessage = "Service is unavailable right now. Please try again later"
  // custom error message after two times try

  genreList: Array<string> = [
    "Fiction",
    "Mystery & Thriller",
    "Historical Fiction",
    "Fantasy",
    "Romance",
    "Science Fiction",
    "Horror",
    "Humor",
    "Nonfiction",
    "Memoir & Autobiography",
    "History & Biography",
    "Science & Technology",
    "Food & Cookbooks",
    "Graphic Novels & Comics",
    "Poetry",
    "Debut Novel",
    "Young Adult Fiction",
    "Young Adult Fantasy",
    "Middle Grade & Children's",
    "Picture Books"
  ]

  async purchaseBook(selectedBook: string): Promise<any> {
    return await axios
      .post<Purchase>(`${process.env.VUE_APP_BACKEND_URL}/purchase`, {
        selectedBook: selectedBook
      })
      .catch(async (err: Error | AxiosError) => {
        if (this.purchaseRetry < 2) {
          this.purchaseRetry += 1
          await this.purchaseBook(selectedBook)
        }
        if (axios.isAxiosError(err) && err.response) {
          this.errorMessage = (err.response.data as ErrorResponse).message
        } else {
          this.errorMessage = this.serviceErrorMessage
        }
        throw this.errorMessage
      })
  }

  async getBook(genre: string): Promise<any> {
    return await axios
      .post<Book>(
        `${process.env.VUE_APP_BACKEND_URL}/getBook`,
        {
          selectedGenre: genre
        }
        // { timeout: 2000 } => to test retry if timeout problem
      )
      .catch(async (err: Error | AxiosError) => {
        if (this.bookRetry < 2) {
          this.bookRetry += 1
          await this.getBook(genre)
        }
        if (axios.isAxiosError(err) && err.response) {
          this.errorMessage = (err.response.data as ErrorResponse).message
        } else {
          this.errorMessage = this.serviceErrorMessage
        }
        throw this.errorMessage
      })
  }

  async handleClick(genre: string) {
    let selectedBook = ""
    this.purchaseInfo = `Your book is preparing from ${genre} category`
    this.step += 1

    const bookResponse = await this.getBook(genre)

    selectedBook = bookResponse.data.name as string
    this.step += 1
    this.purchaseInfo = `Your selected book is ${selectedBook}. You are navigating to the checkout page. Please wait`

    await this.purchaseBook(selectedBook)
    this.step += 1
    this.purchaseInfo = `Your purchase is succesful !`
  }
}
</script>

<style lang="scss">
body {
  background-color: #2980b9;
  font-family: "helvetica", sans-serif;
}

.container {
  position: relative;
  width: 100%;
  max-width: 960px;
  margin: 0px auto;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  .element-card {
    position: relative;
    width: 100px;
    height: 130px;
    box-shadow: 4px 4px 20px rgba(0, 0, 0, 0.4);
    margin: 5px;
    cursor: pointer;

    .front-facing {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      background-color: #ecf0f1;
      border: 2px white solid;
      border-radius: 5px;
      .abr {
        width: 100%;
        position: absolute;
        top: 50%;
        left: 0;
        font-size: 42px;
        margin: -35px 0 0 0;
        text-align: center;
        color: #3498db;
      }
      .title {
        width: 100%;
        position: absolute;
        top: 50%;
        left: 0;
        text-transform: uppercase;
        font-size: 12px;
        margin: 15px 0 0 0;
        text-align: center;
        color: #3498db;
      }
      .atomic-number {
        position: absolute;
        top: 10px;
        left: 10px;
        font-size: 12px;
        color: #2980b9;
      }
    }
  }
  .loading-text {
    font-size: 30px;
    color: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .info-text {
    font-size: 40px;
    color: #fff;
    margin-bottom: 15px;
    width: 100%;
  }
}
</style>
