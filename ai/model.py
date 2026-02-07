import tensorflow as tf
from tensorflow.keras import layers, models

def build_model(input_shape=(128, 128, 3)):
    """
    Builds the MobileNetV2-based Deepfake Detection model.
    Matches the architecture defined in the original notebook.
    """
    base = tf.keras.applications.MobileNetV2(
        input_shape=input_shape,
        include_top=False,
        weights="imagenet"
    )

    base.trainable = True
    for layer in base.layers[:-40]:  # Fine tune last 40 layers
        layer.trainable = False

    inp = layers.Input(shape=input_shape)
    x = tf.keras.applications.mobilenet_v2.preprocess_input(inp)
    x = base(x, training=False) # Use training=False for inference to keep BN statistics fixed
    x = layers.GlobalAveragePooling2D()(x)
    x = layers.Dense(512, activation="relu")(x)
    x = layers.Dropout(0.3)(x)
    x = layers.Dense(256, activation="relu")(x)
    x = layers.Dropout(0.3)(x)
    x = layers.Dense(64, activation="relu")(x)
    x = layers.Dropout(0.3)(x)
    out = layers.Dense(1, activation="sigmoid", dtype="float32")(x)

    model = models.Model(inp, out)

    model.compile(
        optimizer=tf.keras.optimizers.Adam(1e-5),
        loss="binary_crossentropy",
        metrics=["accuracy"]
    )

    return model
