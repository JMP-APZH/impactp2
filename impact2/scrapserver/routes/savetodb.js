import { useMutation } from '@redwoodjs/web'

const CREATE_DAIRY_MUTATION = gql`
  mutation CreateDairyMutation($input: CreateDairyInput!) {
    createDairy(input: $input) {
      id
    }
  }
`
const SaveDairy = () => {
  const [createDairy, { loading, error }] = useMutation(CREATE_DAIRY_MUTATION, {
    onCompleted: () => {
      toast.success('Dairy created')
      navigate(routes.dairies())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onSave = (input) => {
    createDairy({ variables: { input } })
  }

  return (
  <>
    <p></p>
  </>
  )

}
  export default SaveDairy
