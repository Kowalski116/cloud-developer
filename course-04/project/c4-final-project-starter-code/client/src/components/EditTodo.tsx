import * as React from 'react'
import { Form, Button, Checkbox } from 'semantic-ui-react'
import Auth from '../auth/Auth'
import { getTodo, getUploadUrl, patchTodo, uploadFile } from '../api/todos-api'
import { History } from 'history'
import { Todo } from '../types/Todo'
import { UpdateTodoRequest } from '../types/UpdateTodoRequest'

enum UploadState {
  NoUpload,
  FetchingPresignedUrl,
  UploadingFile
}

interface EditTodoProps {
  match: {
    params: {
      todoId: string
    }
  }
  auth: Auth
  history: History
}

interface EditTodoState extends Todo {
  file: any
  uploadState: UploadState
  loading: boolean
}

export class EditTodo extends React.PureComponent<
  EditTodoProps,
  Partial<EditTodoState>
> {
  state: Partial<EditTodoState> = {
    file: undefined,
    uploadState: UploadState.NoUpload,
    name: '',
    note: '',
    loading: true
  }

  handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    this.setState({
      file: files[0]
    })
  }

  handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()

    try {
      if (!this.state.file) {
        alert('File should be selected')
        return
      }

      this.setUploadState(UploadState.FetchingPresignedUrl)
      const uploadUrl = await getUploadUrl(
        this.props.auth.getIdToken(),
        this.props.match.params.todoId
      )

      this.setUploadState(UploadState.UploadingFile)
      await uploadFile(uploadUrl, this.state.file)

      alert('File was uploaded!')
    } catch (e) {
      alert('Could not upload a file: ' + (e as Error).message)
    } finally {
      this.setUploadState(UploadState.NoUpload)
    }
  }
  handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    this.setState({ [e.target.name]: e.target.value } as any)
  }

  setUploadState(uploadState: UploadState) {
    this.setState({
      uploadState
    })
  }

  async componentDidMount() {
    try {
      const todo = await getTodo(
        this.props.auth.getIdToken(),
        this.props.match.params.todoId
      )
      this.setState({ ...todo, loading: false })
    } catch (e) {
      alert(`Failed to get todo: ${(e as Error).message}`)
    }
  }

  handleUpdateTask = async (event: React.SyntheticEvent) => {
    event.preventDefault()

    try {
      this.setState({ loading: true })

      await patchTodo(
        this.props.auth.getIdToken(),
        this.props.match.params.todoId,
        {
          ...this.state
        } as UpdateTodoRequest
      )
      alert('Update successfully!')
    } catch (e) {
      alert('Error: ' + (e as Error).message)
    } finally {
      this.setState({ loading: false })
    }
  }

  render() {
    return (
      <div>
        <h1>Task Detail</h1>
        <Form onSubmit={this.handleUpdateTask} loading={this.state.loading}>
          <Form.Field>
            <label>Name *</label>
            <input
              required
              name="name"
              placeholder="Task name"
              value={this.state.name}
              onChange={this.handleChange}
            />
          </Form.Field>
          <Form.Field>
            <label>Note</label>
            <input
              placeholder="Note"
              name="note"
              value={this.state.note}
              onChange={this.handleChange}
            />
          </Form.Field>
          <Button type="submit" loading={this.state.loading}>
            Save
          </Button>
        </Form>

        <h1>Update image</h1>
        <Form onSubmit={this.handleSubmit}>
          <Form.Field>
            <label>File</label>
            <input
              type="file"
              accept="image/*"
              placeholder="Image to upload"
              onChange={this.handleFileChange}
            />
          </Form.Field>

          {this.renderButton()}
        </Form>
      </div>
    )
  }

  renderButton() {
    return (
      <div>
        {this.state.uploadState === UploadState.FetchingPresignedUrl && (
          <p>Uploading image metadata</p>
        )}
        {this.state.uploadState === UploadState.UploadingFile && (
          <p>Uploading file</p>
        )}
        <Button
          loading={this.state.uploadState !== UploadState.NoUpload}
          type="submit"
        >
          Upload
        </Button>
      </div>
    )
  }
}
