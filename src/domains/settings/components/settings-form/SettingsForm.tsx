import React, { ChangeEvent, useEffect, useState } from "react";
import { Field, Formik } from "formik";
import { Button, Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import { ArrowRight } from "react-bootstrap-icons";
import {
  deleteUserPhoto,
  useUpdateUserDetails,
  useUploadProfilePhoto
} from "../../../../api/user-api";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../../../firebase";
import { UserDetails, UserDetailsUpdater } from "../../../../api/types";
import { useFilePicker } from "use-file-picker";
import { QueryClient } from "react-query";
import { Timestamp } from "firebase/firestore";
import { PopupAlert } from "../../../common/popup-alert";

interface SettingsFormFields {
  name: string;
  dateOfBirth: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
  offerNotifications: boolean;
  newsNotifications: boolean;
  unreadMessagesNotifications: boolean;
  darkMode: boolean;
}

interface SettingsFormProps {
  userDetails: UserDetails;
  userDetailsLoading: boolean;
  userDetailsError: boolean;
}
export function SettingsForm({
  userDetails,
  userDetailsLoading,
  userDetailsError,
}: SettingsFormProps) {
  const [user, userLoading, error] = useAuthState(auth);
  const uploadProfileMutation = useUploadProfilePhoto();
  const updateUserMutation = useUpdateUserDetails();


  const [profilePhotoURL, setProfilePhotoURL] = useState("");
  const [profilePhotoFilename, setProfilePhotoFilename] = useState("");


  const [openFileSelector, { plainFiles, loading }] = useFilePicker({
    accept: [".png", ".jpg", ".PNG", ".JPG"],
    // readFilesContent: false,
    limitFilesConfig: { max: 1 },
  });

  const handleChangePhoto = () => openFileSelector();

  useEffect(() => {
    if (plainFiles.length) {
      if (profilePhotoFilename && user)
        deleteUserPhoto(user.uid, profilePhotoFilename);
      if (user)
        uploadProfileMutation.mutate({ uid: user.uid, image: plainFiles[0] });
      // .then((url: string) => setProfilePhotoURL(url));
      setProfilePhotoFilename(plainFiles[0].name);
    }
  }, [plainFiles, profilePhotoFilename, user]);

  useEffect(() => {
    if (userDetails) {
      setProfilePhotoFilename(userDetails.photo);

      setInitialValues({
        name: userDetails.name,
        dateOfBirth: userDetails.dateOfBirth.toDate().toISOString().split("T")[0],
        emailNotifications: userDetails.notifications.email,
        smsNotifications: userDetails.notifications.sms,
        offerNotifications: userDetails.notificationTypes.offers,
        newsNotifications: userDetails.notificationTypes.news,
        unreadMessagesNotifications: userDetails.notificationTypes.unreadMessages,
        darkMode: true,
      } as SettingsFormFields);
    }
  }, [userDetails]);

  useEffect(() => {
    const colorTheme = localStorage.getItem("colorTheme");
  }, []);

  const [initialFieldValues, setInitialValues] = useState<SettingsFormFields>();

  const queryClient = new QueryClient();
  const onSubmit = async (values: SettingsFormFields) => {

    const details: UserDetailsUpdater = {...values, dateOfBirth: Timestamp.fromDate(new Date(values.dateOfBirth))}

    updateUserMutation.mutate({uid: userDetails.uid, details});
    await queryClient.invalidateQueries(["getUserDetails", userDetails.uid]);
  }

  if (!initialFieldValues) return (<>Loading...</>);
  else return (
    <Formik initialValues={initialFieldValues!} onSubmit={onSubmit}>
      {({ values, handleChange, handleBlur , handleSubmit}) => (
        <Form id="form" onSubmit={handleSubmit}>
          <Button type="submit">Save settings</Button>

          <Container>
            <Row className="settings-section">
              <Col sm={4}>
                <p>Profile Photo</p>
              </Col>
              <Col sm={8} id="profile-photo">
                <Row>
                  <div id="avatar-container">
                    <img
                      src={profilePhotoURL}
                      className="rounded-circle"
                      id="avatar"
                      alt="Avatar"
                    />
                  </div>
                </Row>
                <Row className="settings-button-container">
                  <Button
                    className="settings-button"
                    variant="secondary"
                    onClick={handleChangePhoto}
                  >
                    Change Photo
                  </Button>
                </Row>
                <Row className="settings-button-container">
                  <Button
                    className="settings-button"
                    variant="secondary"
                    disabled={!profilePhotoURL}
                  >
                    Remove Photo
                  </Button>
                </Row>
              </Col>
            </Row>
            <hr />
            <Row className="settings-section">
              <Col sm={4}>
                <p>Name</p>
              </Col>
              <Col sm={8}>
                <Field
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  component={Form.Control}
                />
              </Col>
            </Row>
            <hr />
            <Row className="settings-section">
              <Col sm={4}>
                <p>Date of Birth</p>
              </Col>
              <Col sm={8}>
                <Field
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={values.dateOfBirth}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  component={Form.Control}
                />
              </Col>
            </Row>
            <hr />
            <Row className="settings-section">
              <Col sm={4}>
                <p>Push Notifications</p>
              </Col>
              <Col sm={8}>
                <Field
                  type="switch"
                  id="emailNotifications"
                  name="emailNotifications"
                  label="Email"
                  checked={values.emailNotifications}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  component={Form.Check}
                />
                <Field
                  type="switch"
                  id="smsNotifications"
                  name="smsNotifications"
                  label="SMS"
                  checked={values.smsNotifications}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  component={Form.Check}
                />
              </Col>
            </Row>
            <hr />
            <Row className="settings-section">
              <Col sm={4}>
                <p>Notification Types</p>
              </Col>
              <Col sm={8}>
                <Field
                  type="switch"
                  id="offerNotifications"
                  name="offerNotifications"
                  checked={values.offerNotifications}
                  label="Offers"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  component={Form.Check}
                />
                <Field
                  type="switch"
                  id="newsNotifications"
                  name="newsNotifications"
                  checked={values.newsNotifications}
                  label="News"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  component={Form.Check}
                />
                <Field
                  type="switch"
                  id="unreadMessagesNotifications"
                  name="unreadMessagesNotifications"
                  checked={values.unreadMessagesNotifications}
                  label="Unread Messages"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  component={Form.Check}
                />
              </Col>
            </Row>
            <hr />
            <Row className="settings-section">
              <Col sm={4}>Dark Mode</Col>
              <Col sm={8}>
                <Field
                  type="switch"
                  name="darkMode"
                  id="darkMode"
                  checked={values.darkMode}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  component={Form.Check}
                />
              </Col>
            </Row>
            <hr />
            <Row className="settings-section">
              <Col sm={4}>Privacy</Col>
              <Col sm={8}>
                <a className="link" href="/">
                  Privacy Policy <ArrowRight />
                </a>
                <a className="link" href="/">
                  Cookie Policy <ArrowRight />
                </a>
              </Col>
            </Row>
            <hr />
            <Row className="settings-section">
              <Col sm={4}>Legal</Col>
              <Col sm={8}>
                <a className="link" href="/">
                  Terms and Conditions <ArrowRight />
                </a>
                <a className="link" href="/">
                  Licenses <ArrowRight />
                </a>
              </Col>
            </Row>
            <hr />
            <Row className="settings-section">
              <Col sm={4}>Other</Col>
              <Col sm={8}>
                <Row className="settings-button-container">
                  <Button className="settings-button" variant="danger">
                    Logout
                  </Button>
                </Row>
                <Row className="settings-button-container">
                  <Button className="settings-button" variant="danger">
                    Delete Account
                  </Button>
                </Row>
              </Col>
            </Row>
          </Container>
        </Form>
      )}
    </Formik>
  );
}
