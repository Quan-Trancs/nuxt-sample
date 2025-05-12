<template>
  <div class="space-y-2">
    <div v-if="reviews.length === 0">No reviews yet</div>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
      <div class="flex flex-col gap-2">
        <div v-if="reviews.length !== 0">
          <RatingSummary
            :avg-rating="recipe.avgRating"
            :num-reviews="recipe.numReviews"
            :rating-distribution="recipe.ratingDistribution"
          />
        </div>
        <USeparator class="my-3" />
        <div class="space-y-3">
          <h3 class="font-bold text-lg lg:text-xl">Review this product</h3>
          <p class="text-sm">Share your thoughts with other customers</p>
          <div v-if="userId">
            <Dialog v-model="open">
              <Button
                variant="outline"
                class="rounded-full w-full"
                @click="handleOpenForm"
              >
                Write a customer review
              </Button>

              <DialogContent class="sm:max-w-[425px]">
                <Form @submit.prevent="onSubmit">
                  <DialogHeader>
                    <DialogTitle> Write a customer review </DialogTitle>
                    <DialogDescription>
                      Share your thoughts with other customers
                    </DialogDescription>
                  </DialogHeader>
                  <div class="grid gap-4 py-4">
                    <div class="flex flex-col gap-5">
                      <FormField
                        v-model="formData.title"
                        label="{{ t('Title') }}"
                        placeholder="{{ t('Enter title') }}"
                      />
                      <FormField
                        v-model="formData.comment"
                        label="{{ t('Comment') }}"
                        placeholder="{{ t('Enter comment') }}"
                        textarea
                      />
                    </div>
                    <div>
                      <FormField
                        v-model="formData.rating"
                        label="{{ t('Rating') }}"
                      >
                        <Select v-model="formData.rating">
                          <SelectTrigger>
                            <SelectValue
                              placeholder="{{ t('Select a rating') }}"
                            />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem
                              v-for="index in 5"
                              :key="index"
                              :value="index.toString()"
                            >
                              <div class="flex items-center gap-1">
                                {{ index }} <StarIcon class="h-4 w-4" />
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormField>
                    </div>
                  </div>

                  <DialogFooter>
                    <Button :disabled="isSubmitting" type="submit" size="lg">
                      {{ isSubmitting ? 'Submitting...' : 'Submit' }}
                    </Button>
                  </DialogFooter>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
          <div v-else>
            <p>
              Please
              <Link
                :href="`/sign-in?callbackUrl=/product/${recipe.slug}`"
                class="highlight-link"
                >sign in</Link
              >
              to write a review
            </p>
          </div>
        </div>
      </div>

      <div class="md:col-span-3 flex flex-col gap-3">
        <Card v-for="review in reviews" :key="review.id">
          <CardHeader>
            <div class="flex-between">
              <CardTitle>{{ review.reviewerName }}</CardTitle>
              <div class="italic text-sm flex">
                <Check class="h-4 w-4" /> Verified Purchase
              </div>
            </div>
            <CardDescription>{{ review.comment }}</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="flex space-x-4 text-sm text-muted-foreground">
              <Rating :rating="review.rating" />
              <div class="flex items-center">
                <User class="mr-1 h-3 w-3" />
                <span>{{ review.author?.name ?? 'Deleted User' }}</span>
              </div>
              <div class="flex items-center">
                <Calendar class="mr-1 h-3 w-3" />
                {{ review.date.toString().substring(0, 10) }}
              </div>
            </div>
          </CardContent>
        </Card>

        <div v-if="page <= totalPages" ref="loadMoreRef">
          <Button variant="link" @click="loadMoreReviews">
            See more reviews
          </Button>
        </div>

        <div v-if="page < totalPages && loadingReviews">loading</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { getReviewsBySlug } from '@/composables/actions/review.actions'
import type { IRecipeInput, IReview } from '~/types'

export default defineComponent({
  props: {
    userId: {
      type: String,
      required: false,
      default: '',
    },
    recipe: {
      type: Object as () => IRecipeInput,
      required: true,
    },
  },
  setup(props) {
    const toast = useToast()

    const page = ref(1)
    const totalPages = ref(0)
    const reviews = ref<IReview[]>([])
    const loadingReviews = ref(false)
    const open = ref(false)
    const isSubmitting = ref(false)
    const formData = ref({
      title: '',
      comment: '',
      rating: 0,
    })

    const reload = () => {
      try {
        const res = getReviewsBySlug(props.recipe.slug, 1)
        reviews.value = res.reviews ?? []
        totalPages.value = res.totalPages ?? 0
      } catch {
        toast.add({
          title: 'Error',
          description: 'Error in fetching reviews',
          color: 'error',
        }) // Show an error toast
      }
    }

    const loadMoreReviews = () => {
      if (totalPages.value !== 0 && page.value > totalPages.value) return
      loadingReviews.value = true
      const res = getReviewsBySlug(props.recipe.id, page.value)
      loadingReviews.value = false
      reviews.value = [...reviews.value, ...(res.reviews ?? [])]
      if (res.totalPages) {
        totalPages.value = res.totalPages
        page.value += 1
      }
    }

    const handleOpenForm = async () => {
      // Implement your form setup logic
      open.value = true
    }

    const onSubmit = async () => {}

    onMounted(() => {
      reload()
    })

    return {
      page,
      totalPages,
      reviews,
      loadingReviews,
      open,
      isSubmitting,
      formData,
      reload,
      loadMoreReviews,
      handleOpenForm,
      onSubmit,
    }
  },
})
</script>

<style scoped>
/* Add your component-specific styles here */
</style>
